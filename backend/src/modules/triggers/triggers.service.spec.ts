import { Test, TestingModule } from '@nestjs/testing';
import { TriggersService } from './triggers.service';
import * as supabaseConfig from '../../config/supabase.config';
import { ValidationException, ForbiddenException, NotFoundException } from '../../common/exceptions/app.exception';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Builds a chainable Supabase query mock that resolves to { data, error } */
function makeQuery(data: any, error: any = null) {
  const chain: any = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  };
  // make the chain itself thenable (for awaited queries without .single())
  chain.then = (resolve: any) => resolve({ data, error });
  return chain;
}

/** Builds a mock Supabase client */
function makeSupabaseMock(overrides: Partial<{
  rpcResult: any;
  rpcError: any;
  queryData: any;
  queryError: any;
}> = {}) {
  const {
    rpcResult = { success: true, trigger_id: 'trigger-uuid', post_title: 'Test Post', expires_at: '2099-01-01T00:00:00Z' },
    rpcError = null,
    queryData = null,
    queryError = null,
  } = overrides;

  const rpc = jest.fn().mockResolvedValue({ data: rpcResult, error: rpcError });

  const fromChain: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: queryData, error: queryError }),
    update: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: queryData, error: queryError }),
  };

  const from = jest.fn().mockReturnValue(fromChain);

  return { rpc, from };
}

// ─── test suite ─────────────────────────────────────────────────────────────

describe('TriggersService', () => {
  let service: TriggersService;
  let supabaseSpy: jest.SpyInstance;

  const FINDER_ID = 'finder-user-uuid';
  const TARGET_ID = 'target-user-uuid';
  const POST_ID = 'post-uuid';
  const TRIGGER_ID = 'trigger-uuid';
  const CONV_ID = 'conv-uuid';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function setupService(supabaseMock: any) {
    supabaseSpy = jest.spyOn(supabaseConfig, 'getSupabaseClient').mockReturnValue(supabaseMock as any);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TriggersService],
    }).compile();

    service = module.get<TriggersService>(TriggersService);
  });

  // ──────────────────────────────────────────────────────────────────────────
  //  create()
  // ──────────────────────────────────────────────────────────────────────────
  describe('create()', () => {
    it('should call create_trigger RPC with correct params and return result', async () => {
      const rpcResult = {
        success: true,
        trigger_id: TRIGGER_ID,
        post_title: 'Found: Blue Wallet',
        expires_at: '2099-01-01T00:00:00Z',
      };
      const mock = makeSupabaseMock({ rpcResult });
      setupService(mock);

      const dto = { post_id: POST_ID, post_type: 'found' as const, target_user_id: TARGET_ID, conversation_id: CONV_ID };
      const result = await service.create(dto, FINDER_ID);

      expect(mock.rpc).toHaveBeenCalledWith('create_trigger', {
        p_post_id: POST_ID,
        p_post_type: 'found',
        p_created_by: FINDER_ID,
        p_target_user: TARGET_ID,
        p_conversation: CONV_ID,
        p_points: 10,
      });
      expect(result.trigger_id).toBe(TRIGGER_ID);
      expect(result.success).toBe(true);
    });

    it('should pass null for conversation_id when not provided', async () => {
      const mock = makeSupabaseMock();
      setupService(mock);

      const dto = { post_id: POST_ID, post_type: 'found' as const, target_user_id: TARGET_ID };
      await service.create(dto, FINDER_ID);

      expect(mock.rpc).toHaveBeenCalledWith('create_trigger', expect.objectContaining({
        p_conversation: null,
      }));
    });

    it('should throw ValidationException when Supabase RPC returns an error', async () => {
      const mock = makeSupabaseMock({ rpcError: { message: 'connection timeout' } });
      setupService(mock);

      const dto = { post_id: POST_ID, post_type: 'found' as const, target_user_id: TARGET_ID };
      await expect(service.create(dto, FINDER_ID)).rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException when RPC returns success:false (duplicate pending)', async () => {
      const mock = makeSupabaseMock({
        rpcResult: { success: false, error: 'Đã có yêu cầu xác nhận đang chờ cho bài đăng này' },
      });
      setupService(mock);

      const dto = { post_id: POST_ID, post_type: 'found' as const, target_user_id: TARGET_ID };
      await expect(service.create(dto, FINDER_ID)).rejects.toThrow(
        'Đã có yêu cầu xác nhận đang chờ cho bài đăng này',
      );
    });

    it('should throw ValidationException when RPC returns success:false (not post owner)', async () => {
      const mock = makeSupabaseMock({
        rpcResult: { success: false, error: 'Bạn không phải chủ bài đăng này' },
      });
      setupService(mock);

      const dto = { post_id: POST_ID, post_type: 'found' as const, target_user_id: TARGET_ID };
      await expect(service.create(dto, FINDER_ID)).rejects.toThrow('Bạn không phải chủ bài đăng này');
    });

    it('should throw ValidationException when RPC returns success:false (post not approved)', async () => {
      const mock = makeSupabaseMock({
        rpcResult: { success: false, error: 'Bài đăng đang ở trạng thái "pending"' },
      });
      setupService(mock);

      const dto = { post_id: POST_ID, post_type: 'found' as const, target_user_id: TARGET_ID };
      await expect(service.create(dto, FINDER_ID)).rejects.toThrow();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  //  confirm()
  // ──────────────────────────────────────────────────────────────────────────
  describe('confirm()', () => {
    it('should call confirm_trigger RPC with correct params', async () => {
      const rpcResult = { success: true, trigger_id: TRIGGER_ID, points_awarded: 10, finder_balance: 50 };
      const mock = makeSupabaseMock({ rpcResult });
      setupService(mock);

      const result = await service.confirm(TRIGGER_ID, TARGET_ID);

      expect(mock.rpc).toHaveBeenCalledWith('confirm_trigger', {
        p_trigger_id: TRIGGER_ID,
        p_user_id: TARGET_ID,
      });
      expect(result.points_awarded).toBe(10);
      expect(result.finder_balance).toBe(50);
    });

    it('should throw ValidationException when Supabase RPC errors', async () => {
      const mock = makeSupabaseMock({ rpcError: { message: 'db error' } });
      setupService(mock);

      await expect(service.confirm(TRIGGER_ID, TARGET_ID)).rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException when trigger not pending (already confirmed)', async () => {
      const mock = makeSupabaseMock({ rpcResult: { success: false, error: 'Trigger đã được xử lý: confirmed' } });
      setupService(mock);

      await expect(service.confirm(TRIGGER_ID, TARGET_ID)).rejects.toThrow('Trigger đã được xử lý: confirmed');
    });

    it('should throw ValidationException when trigger is expired', async () => {
      const mock = makeSupabaseMock({ rpcResult: { success: false, error: 'Trigger đã hết hạn' } });
      setupService(mock);

      await expect(service.confirm(TRIGGER_ID, TARGET_ID)).rejects.toThrow('Trigger đã hết hạn');
    });

    it('should throw ValidationException when wrong user tries to confirm', async () => {
      const mock = makeSupabaseMock({ rpcResult: { success: false, error: 'Bạn không có quyền xác nhận trigger này' } });
      setupService(mock);

      await expect(service.confirm(TRIGGER_ID, 'wrong-user')).rejects.toThrow('Bạn không có quyền xác nhận trigger này');
    });

    it('should throw when finder is suspended', async () => {
      const mock = makeSupabaseMock({ rpcResult: { success: false, error: 'Người nhặt đồ đã bị khóa tài khoản. Vui lòng liên hệ admin.' } });
      setupService(mock);

      await expect(service.confirm(TRIGGER_ID, TARGET_ID)).rejects.toThrow('Người nhặt đồ đã bị khóa tài khoản');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  //  cancel()
  // ──────────────────────────────────────────────────────────────────────────
  describe('cancel()', () => {
    it('should call cancel_trigger RPC with correct params', async () => {
      const rpcResult = { success: true, trigger_id: TRIGGER_ID };
      const mock = makeSupabaseMock({ rpcResult });
      setupService(mock);

      const result = await service.cancel(TRIGGER_ID, FINDER_ID);

      expect(mock.rpc).toHaveBeenCalledWith('cancel_trigger', {
        p_trigger_id: TRIGGER_ID,
        p_user_id: FINDER_ID,
      });
      expect(result.trigger_id).toBe(TRIGGER_ID);
    });

    it('should throw ValidationException when Supabase RPC errors', async () => {
      const mock = makeSupabaseMock({ rpcError: { message: 'network error' } });
      setupService(mock);

      await expect(service.cancel(TRIGGER_ID, FINDER_ID)).rejects.toThrow(ValidationException);
    });

    it('should throw when non-owner tries to cancel', async () => {
      const mock = makeSupabaseMock({ rpcResult: { success: false, error: 'Bạn không có quyền hủy trigger này' } });
      setupService(mock);

      await expect(service.cancel(TRIGGER_ID, 'stranger')).rejects.toThrow('Bạn không có quyền hủy trigger này');
    });

    it('should throw when trigger already processed', async () => {
      const mock = makeSupabaseMock({ rpcResult: { success: false, error: 'Trigger đã được xử lý: cancelled' } });
      setupService(mock);

      await expect(service.cancel(TRIGGER_ID, FINDER_ID)).rejects.toThrow('Trigger đã được xử lý: cancelled');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  //  getByConversation()
  // ──────────────────────────────────────────────────────────────────────────
  describe('getByConversation()', () => {
    const mockConv = { id: CONV_ID, user_a_id: FINDER_ID, user_b_id: TARGET_ID };

    const mockTriggers = [
      {
        id: TRIGGER_ID,
        post_id: POST_ID,
        post_type: 'found',
        status: 'confirmed',
        points_awarded: 10,
        confirmed_at: '2026-04-13T10:00:00Z',
        cancelled_at: null,
        expires_at: '2026-04-15T10:00:00Z',
        created_at: '2026-04-13T08:00:00Z',
        creator: { id: FINDER_ID, full_name: 'Finder Name', avatar_url: null },
        target: { id: TARGET_ID, full_name: 'Target Name', avatar_url: null },
      },
    ];

    it('should return triggers list for a valid participant', async () => {
      const supabaseMock: any = {
        rpc: jest.fn(),
        from: jest.fn(),
      };

      // First call: conversations table
      const convChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockConv, error: null }),
      };

      // Second call: triggers table
      const triggerChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockTriggers, error: null }),
      };

      supabaseMock.from
        .mockReturnValueOnce(convChain)   // conversations
        .mockReturnValueOnce(triggerChain); // triggers

      setupService(supabaseMock);

      const result = await service.getByConversation(CONV_ID, FINDER_ID);

      expect(supabaseMock.from).toHaveBeenCalledWith('conversations');
      expect(supabaseMock.from).toHaveBeenCalledWith('triggers');
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('confirmed');
    });

    it('should throw NotFoundException when conversation does not exist', async () => {
      const supabaseMock: any = {
        rpc: jest.fn(),
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      };
      setupService(supabaseMock);

      await expect(service.getByConversation(CONV_ID, FINDER_ID)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not a participant', async () => {
      const supabaseMock: any = {
        rpc: jest.fn(),
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: CONV_ID, user_a_id: 'someone-else', user_b_id: 'another-person' },
            error: null,
          }),
        }),
      };
      setupService(supabaseMock);

      await expect(service.getByConversation(CONV_ID, FINDER_ID)).rejects.toThrow(ForbiddenException);
    });

    it('should return empty array when no triggers exist in conversation', async () => {
      const supabaseMock: any = {
        rpc: jest.fn(),
        from: jest.fn(),
      };

      const convChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockConv, error: null }),
      };
      const triggerChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      supabaseMock.from
        .mockReturnValueOnce(convChain)
        .mockReturnValueOnce(triggerChain);

      setupService(supabaseMock);

      const result = await service.getByConversation(CONV_ID, FINDER_ID);
      expect(result).toEqual([]);
    });

    it('should throw ValidationException when triggers query fails', async () => {
      const supabaseMock: any = {
        rpc: jest.fn(),
        from: jest.fn(),
      };

      const convChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockConv, error: null }),
      };
      const triggerChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: { message: 'query error' } }),
      };

      supabaseMock.from
        .mockReturnValueOnce(convChain)
        .mockReturnValueOnce(triggerChain);

      setupService(supabaseMock);

      await expect(service.getByConversation(CONV_ID, FINDER_ID)).rejects.toThrow(ValidationException);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  //  expirePendingTriggers() — cron job
  // ──────────────────────────────────────────────────────────────────────────
  describe('expirePendingTriggers()', () => {
    it('should update expired pending triggers', async () => {
      const supabaseMock: any = {
        rpc: jest.fn(),
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          lt: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue({ data: [{ id: TRIGGER_ID }], error: null }),
        }),
      };
      setupService(supabaseMock);

      // Should not throw
      await expect(service.expirePendingTriggers()).resolves.toBeUndefined();

      expect(supabaseMock.from).toHaveBeenCalledWith('triggers');
    });

    it('should handle empty result gracefully (no expired triggers)', async () => {
      const supabaseMock: any = {
        rpc: jest.fn(),
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          lt: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      };
      setupService(supabaseMock);

      await expect(service.expirePendingTriggers()).resolves.toBeUndefined();
    });

    it('should log error and not throw when Supabase fails', async () => {
      const supabaseMock: any = {
        rpc: jest.fn(),
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          lt: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue({ data: null, error: { message: 'db connection failed' } }),
        }),
      };
      setupService(supabaseMock);

      // Should NOT throw — cron jobs must be resilient
      await expect(service.expirePendingTriggers()).resolves.toBeUndefined();
    });
  });
});
