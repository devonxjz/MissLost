import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getSupabaseClient } from '../../config/supabase.config';
import { CreateTriggerDto } from './dto/trigger.dto';
import { ValidationException, ForbiddenException, NotFoundException } from '../../common/exceptions/app.exception';

/** JSON trả về từ Postgres function */
export interface TriggerRpcResult {
  success: boolean;
  error?: string;
  trigger_id?: string;
  post_title?: string;
  expires_at?: string;
  points_awarded?: number;
  finder_balance?: number;
}

@Injectable()
export class TriggersService {
  private readonly logger = new Logger(TriggersService.name);

  private get supabase() {
    return getSupabaseClient();
  }

  /**
   * Tạo trigger — atomic qua Postgres function create_trigger()
   * Validate post ownership + status + notification đều trong 1 transaction
   */
  async create(dto: CreateTriggerDto, userId: string) {
    const { data, error } = await this.supabase.rpc('create_trigger', {
      p_post_id: dto.post_id,
      p_post_type: dto.post_type,
      p_created_by: userId,
      p_target_user: dto.target_user_id,
      p_conversation: dto.conversation_id ?? null,
      p_points: 10,
    });

    if (error) throw new ValidationException(error.message);

    const result = data as TriggerRpcResult;
    if (!result.success) {
      throw new ValidationException(result.error || 'Không thể tạo trigger');
    }

    return result;
  }

  /**
   * Xác nhận trigger — atomic qua Postgres function confirm_trigger()
   * SELECT FOR UPDATE + cộng điểm + notification + close post trong 1 transaction
   */
  async confirm(triggerId: string, userId: string) {
    const { data, error } = await this.supabase.rpc('confirm_trigger', {
      p_trigger_id: triggerId,
      p_user_id: userId,
    });

    if (error) throw new ValidationException(error.message);

    const result = data as TriggerRpcResult;
    if (!result.success) {
      throw new ValidationException(result.error || 'Không thể xác nhận trigger');
    }

    return result;
  }

  /**
   * Hủy trigger — atomic qua Postgres function cancel_trigger()
   * Notification cho target_user trong cùng transaction
   */
  async cancel(triggerId: string, userId: string) {
    const { data, error } = await this.supabase.rpc('cancel_trigger', {
      p_trigger_id: triggerId,
      p_user_id: userId,
    });

    if (error) throw new ValidationException(error.message);

    const result = data as TriggerRpcResult;
    if (!result.success) {
      throw new ValidationException(result.error || 'Không thể hủy trigger');
    }

    return result;
  }

  /**
   * Lấy trigger theo conversation — để chat UI hiển thị trạng thái
   * Verify user là participant trước khi trả về
   */
  async getByConversation(conversationId: string, userId: string) {
    // Verify user là participant của conversation
    const { data: conv } = await this.supabase
      .from('conversations')
      .select('id, user_a_id, user_b_id')
      .eq('id', conversationId)
      .single();

    if (!conv) throw new NotFoundException('Cuộc hội thoại', conversationId);
    if (conv.user_a_id !== userId && conv.user_b_id !== userId) {
      throw new ForbiddenException('Bạn không tham gia cuộc hội thoại này');
    }

    const { data: triggers, error } = await this.supabase
      .from('triggers')
      .select(`
        id, post_id, post_type, status, points_awarded,
        confirmed_at, cancelled_at, expires_at, created_at,
        creator:users!triggers_created_by_fkey(id, full_name, avatar_url),
        target:users!triggers_target_user_id_fkey(id, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false });

    if (error) throw new ValidationException(error.message);
    return triggers ?? [];
  }

  /**
   * Cron job: hết hạn trigger pending sau 48h
   * Chạy mỗi 6 giờ
   */
  @Cron('0 */6 * * *')
  async expirePendingTriggers() {
    try {
      const { data, error } = await this.supabase
        .from('triggers')
        .update({ status: 'expired' })
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString())
        .select('id');

      if (error) {
        this.logger.error(`Cron expire failed: ${error.message}`);
        return;
      }

      if (data && data.length > 0) {
        this.logger.log(`Expired ${data.length} pending trigger(s)`);
      }
    } catch (err) {
      this.logger.error(`Cron expire error: ${(err as Error).message}`);
    }
  }
}
