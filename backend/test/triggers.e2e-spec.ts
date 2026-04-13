/**
 * Integration tests (e2e) — Triggers API endpoints
 *
 * Strategy:
 * - Boot a real NestJS app using only TriggersModule
 * - Override JwtAuthGuard so tests bypass real JWT validation
 * - Mock TriggersService so no Supabase/DB calls are made
 * - Test HTTP status codes, response shapes, and error paths
 *
 * Run: npx jest --config ./test/jest-e2e.json --testPathPattern triggers
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import { TriggersController } from '../src/modules/triggers/triggers.controller';
import { TriggersService } from '../src/modules/triggers/triggers.service';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import {
  ValidationException,
  ForbiddenException,
  NotFoundException,
} from '../src/common/exceptions/app.exception';

// ─── constants ──────────────────────────────────────────────────────────────

const FINDER_ID = '11111111-1111-4111-a111-111111111111';
const TARGET_ID = '22222222-2222-4222-a222-222222222222';
const POST_ID   = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
const TRIG_ID   = 'bbbbbbbb-bbbb-4bbb-abbb-bbbbbbbbbbbb';
const CONV_ID   = 'cccccccc-cccc-4ccc-accc-cccccccccccc';

// ─── Guard stub — injects a fake user into request ──────────────────────────

class MockJwtGuard {
  canActivate(context: any): boolean {
    const req = context.switchToHttp().getRequest();
    // Default authenticated user is the FINDER; tests can override via header.
    const userId = req.headers['x-test-user-id'] ?? FINDER_ID;
    req.user = { id: userId };
    return true;
  }
}

// ─── Service mock ────────────────────────────────────────────────────────────

const mockTriggersService = {
  create: jest.fn(),
  confirm: jest.fn(),
  cancel: jest.fn(),
  getByConversation: jest.fn(),
};

// ─── app factory ─────────────────────────────────────────────────────────────

async function buildApp(): Promise<INestApplication> {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [TriggersController],
    providers: [
      { provide: TriggersService, useValue: mockTriggersService },
      { provide: JwtAuthGuard, useClass: MockJwtGuard },
    ],
  })
    .overrideGuard(JwtAuthGuard)
    .useClass(MockJwtGuard)
    .compile();

  const app = module.createNestApplication();
  // Same pipes as production
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe('Triggers API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── POST /triggers ──────────────────────────────────────────────────────

  describe('POST /triggers', () => {
    const validBody = {
      post_id: POST_ID,
      post_type: 'found',
      target_user_id: TARGET_ID,
      conversation_id: CONV_ID,
    };

    it('201 — creates a trigger successfully', async () => {
      mockTriggersService.create.mockResolvedValue({
        success: true,
        trigger_id: TRIG_ID,
        post_title: 'Blue Wallet',
        expires_at: '2099-01-01T00:00:00Z',
      });

      const res = await request(app.getHttpServer())
        .post('/triggers')
        .send(validBody)
        .expect(201);

      expect(res.body.trigger_id).toBe(TRIG_ID);
      expect(mockTriggersService.create).toHaveBeenCalledWith(validBody, FINDER_ID);
    });

    it('201 — creates trigger without optional conversation_id', async () => {
      mockTriggersService.create.mockResolvedValue({ success: true, trigger_id: TRIG_ID });

      const { conversation_id, ...bodyNoConv } = validBody;
      const res = await request(app.getHttpServer())
        .post('/triggers')
        .send(bodyNoConv)
        .expect(201);

      expect(res.body.trigger_id).toBe(TRIG_ID);
    });

    it('400 — rejects missing post_id', async () => {
      const { post_id, ...invalid } = validBody;
      await request(app.getHttpServer())
        .post('/triggers')
        .send(invalid)
        .expect(400);
    });

    it('400 — rejects invalid post_type value', async () => {
      await request(app.getHttpServer())
        .post('/triggers')
        .send({ ...validBody, post_type: 'stolen' })
        .expect(400);
    });

    it('400 — rejects malformed UUID for post_id', async () => {
      await request(app.getHttpServer())
        .post('/triggers')
        .send({ ...validBody, post_id: 'not-a-uuid' })
        .expect(400);
    });

    it('400 — propagates business error from service (duplicate trigger)', async () => {
      mockTriggersService.create.mockRejectedValue(
        new ValidationException('Đã có yêu cầu xác nhận đang chờ cho bài đăng này'),
      );

      await request(app.getHttpServer())
        .post('/triggers')
        .send(validBody)
        .expect(400);

      expect(mockTriggersService.create).toHaveBeenCalled();
    });

    it('400 — propagates error when user is not post owner', async () => {
      mockTriggersService.create.mockRejectedValue(
        new ValidationException('Bạn không phải chủ bài đăng này'),
      );

      await request(app.getHttpServer())
        .post('/triggers')
        .send(validBody)
        .expect(400);
    });
  });

  // ── POST /triggers/:id/confirm ──────────────────────────────────────────

  describe('POST /triggers/:id/confirm', () => {
    it('201 — target user confirms trigger successfully', async () => {
      mockTriggersService.confirm.mockResolvedValue({
        success: true,
        trigger_id: TRIG_ID,
        points_awarded: 10,
        finder_balance: 50,
      });

      const res = await request(app.getHttpServer())
        .post(`/triggers/${TRIG_ID}/confirm`)
        .set('x-test-user-id', TARGET_ID)
        .expect(201);

      expect(res.body.points_awarded).toBe(10);
      expect(mockTriggersService.confirm).toHaveBeenCalledWith(TRIG_ID, TARGET_ID);
    });

    it('400 — trigger already confirmed', async () => {
      mockTriggersService.confirm.mockRejectedValue(
        new ValidationException('Trigger đã được xử lý: confirmed'),
      );

      await request(app.getHttpServer())
        .post(`/triggers/${TRIG_ID}/confirm`)
        .set('x-test-user-id', TARGET_ID)
        .expect(400);
    });

    it('400 — trigger expired', async () => {
      mockTriggersService.confirm.mockRejectedValue(
        new ValidationException('Trigger đã hết hạn'),
      );

      await request(app.getHttpServer())
        .post(`/triggers/${TRIG_ID}/confirm`)
        .set('x-test-user-id', TARGET_ID)
        .expect(400);
    });

    it('400 — wrong user tries to confirm', async () => {
      mockTriggersService.confirm.mockRejectedValue(
        new ValidationException('Bạn không có quyền xác nhận trigger này'),
      );

      await request(app.getHttpServer())
        .post(`/triggers/${TRIG_ID}/confirm`)
        .set('x-test-user-id', 'stranger-id')
        .expect(400);
    });

    it('400 — finder is suspended', async () => {
      mockTriggersService.confirm.mockRejectedValue(
        new ValidationException('Người nhặt đồ đã bị khóa tài khoản. Vui lòng liên hệ admin.'),
      );

      await request(app.getHttpServer())
        .post(`/triggers/${TRIG_ID}/confirm`)
        .set('x-test-user-id', TARGET_ID)
        .expect(400);
    });
  });

  // ── PATCH /triggers/:id/cancel ──────────────────────────────────────────

  describe('PATCH /triggers/:id/cancel', () => {
    it('200 — finder cancels trigger successfully', async () => {
      mockTriggersService.cancel.mockResolvedValue({ success: true, trigger_id: TRIG_ID });

      const res = await request(app.getHttpServer())
        .patch(`/triggers/${TRIG_ID}/cancel`)
        .set('x-test-user-id', FINDER_ID)
        .expect(200);

      expect(res.body.trigger_id).toBe(TRIG_ID);
      expect(mockTriggersService.cancel).toHaveBeenCalledWith(TRIG_ID, FINDER_ID);
    });

    it('400 — non-owner cannot cancel', async () => {
      mockTriggersService.cancel.mockRejectedValue(
        new ValidationException('Bạn không có quyền hủy trigger này'),
      );

      await request(app.getHttpServer())
        .patch(`/triggers/${TRIG_ID}/cancel`)
        .set('x-test-user-id', 'outsider-id')
        .expect(400);
    });

    it('400 — already processed trigger cannot be cancelled', async () => {
      mockTriggersService.cancel.mockRejectedValue(
        new ValidationException('Trigger đã được xử lý: cancelled'),
      );

      await request(app.getHttpServer())
        .patch(`/triggers/${TRIG_ID}/cancel`)
        .expect(400);
    });
  });

  // ── GET /triggers/conversation/:conversationId ──────────────────────────

  describe('GET /triggers/conversation/:conversationId', () => {
    const mockTriggerList = [
      {
        id: TRIG_ID,
        post_id: POST_ID,
        post_type: 'found',
        status: 'confirmed',
        points_awarded: 10,
        confirmed_at: '2026-04-13T10:00:00Z',
        cancelled_at: null,
        expires_at: '2026-04-15T10:00:00Z',
        created_at: '2026-04-13T08:00:00Z',
        creator: { id: FINDER_ID, full_name: 'Finder', avatar_url: null },
        target:  { id: TARGET_ID, full_name: 'Target', avatar_url: null },
      },
    ];

    it('200 — returns triggers for a valid participant', async () => {
      mockTriggersService.getByConversation.mockResolvedValue(mockTriggerList);

      const res = await request(app.getHttpServer())
        .get(`/triggers/conversation/${CONV_ID}`)
        .set('x-test-user-id', FINDER_ID)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].status).toBe('confirmed');
      expect(mockTriggersService.getByConversation).toHaveBeenCalledWith(CONV_ID, FINDER_ID);
    });

    it('200 — returns empty array when no triggers exist', async () => {
      mockTriggersService.getByConversation.mockResolvedValue([]);

      const res = await request(app.getHttpServer())
        .get(`/triggers/conversation/${CONV_ID}`)
        .expect(200);

      expect(res.body).toEqual([]);
    });

    it('404 — conversation not found', async () => {
      mockTriggersService.getByConversation.mockRejectedValue(
        new NotFoundException('Cuộc hội thoại', CONV_ID),
      );

      await request(app.getHttpServer())
        .get(`/triggers/conversation/${CONV_ID}`)
        .expect(404);
    });

    it('403 — non-participant cannot view triggers', async () => {
      mockTriggersService.getByConversation.mockRejectedValue(
        new ForbiddenException('Bạn không tham gia cuộc hội thoại này'),
      );

      await request(app.getHttpServer())
        .get(`/triggers/conversation/${CONV_ID}`)
        .set('x-test-user-id', 'outsider-id')
        .expect(403);
    });
  });
});
