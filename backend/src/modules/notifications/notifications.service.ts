import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../config/supabase.config';

type NotificationType =
  | 'post_approved' | 'post_rejected' | 'match_found'
  | 'new_message' | 'handover_request' | 'handover_completed'
  | 'storage_available' | 'points_awarded' | 'system';

@Injectable()
export class NotificationsService {
  private get supabase() {
    return getSupabaseClient();
  }

  async getMyNotifications(userId: string, page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      data: data ?? [],
      meta: { page, limit, total: count ?? 0 },
    };
  }

  async getUnreadCount(userId: string) {
    const { count } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    return { unread: count ?? 0 };
  }

  async markAsRead(id: string, userId: string) {
    const { data } = await this.supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, is_read')
      .single();

    return data;
  }

  async markAllAsRead(userId: string) {
    await this.supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false);

    return { message: 'Đã đánh dấu tất cả là đã đọc' };
  }

  // Internal: create a notification (called by other services)
  async create(payload: {
    user_id: string;
    type: NotificationType;
    title: string;
    body?: string;
    ref_type?: string;
    ref_id?: string;
  }) {
    const { data } = await this.supabase
      .from('notifications')
      .insert(payload)
      .select('id')
      .single();
    return data;
  }
}
