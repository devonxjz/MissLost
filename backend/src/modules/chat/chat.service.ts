import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../config/supabase.config';
import { CreateConversationDto, SendMessageDto } from './dto/chat.dto';
import { NotFoundException, ForbiddenException, ValidationException } from '../../common/exceptions/app.exception';

@Injectable()
export class ChatService {
  private get supabase() {
    return getSupabaseClient();
  }

  async getMyConversations(userId: string) {
    const { data, error } = await this.supabase
      .from('conversations')
      .select(`
        id, last_message_at, created_at, user_a_id, user_b_id, lost_post_id, found_post_id,
        lost_posts(id, title),
        found_posts(id, title),
        user_a:users!conversations_user_a_id_fkey(id, full_name, avatar_url),
        user_b:users!conversations_user_b_id_fkey(id, full_name, avatar_url),
        messages (id, content, image_url, sender_id, created_at)
      `)
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .order('created_at', { foreignTable: 'messages', ascending: false })
      .limit(1, { foreignTable: 'messages' })
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error) throw error;
    
    // Transform to have last_message
    return (data ?? []).map((conv: any) => ({
      ...conv,
      last_message: conv.messages && conv.messages.length > 0 ? conv.messages[0] : null,
      messages: undefined,
    }));
  }

  async createOrGetConversation(dto: CreateConversationDto, userId: string) {
    if (dto.recipient_id === userId) {
      throw new ValidationException('Không thể tự nhắn tin với chính mình');
    }

    // Check if conversation already exists
    const { data: existing } = await this.supabase
      .from('conversations')
      .select('id')
      .or(`and(user_a_id.eq.${userId},user_b_id.eq.${dto.recipient_id}),and(user_a_id.eq.${dto.recipient_id},user_b_id.eq.${userId})`)
      .eq('lost_post_id', dto.lost_post_id ?? null)
      .maybeSingle();

    if (existing) return existing;

    const { data, error } = await this.supabase
      .from('conversations')
      .insert({
        user_a_id: userId,
        user_b_id: dto.recipient_id,
        lost_post_id: dto.lost_post_id ?? null,
        found_post_id: dto.found_post_id ?? null,
      })
      .select('*')
      .single();

    if (error) throw new ValidationException(error.message);
    return data;
  }

  async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
    // Verify user is participant
    await this.assertParticipant(conversationId, userId);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase
      .from('messages')
      .select(`
        id, sender_id, content, image_url, message_type, is_read, created_at,
        sender:users!messages_sender_id_fkey(id, full_name, avatar_url)
      `, { count: 'exact' })
      .eq('conversation_id', conversationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Mark as read
    await this.supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('is_read', false);

    return {
      data: (data ?? []).reverse(),
      meta: { page, limit, total: count ?? 0 },
    };
  }

  async sendMessage(conversationId: string, dto: SendMessageDto, userId: string) {
    if (!dto.content && !dto.image_url) {
      throw new ValidationException('Tin nhắn phải có nội dung hoặc hình ảnh');
    }

    await this.assertParticipant(conversationId, userId);

    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        content: dto.content ?? null,
        image_url: dto.image_url ?? null,
        message_type: dto.message_type ?? 'text',
      })
      .select(`
        id, sender_id, content, image_url, message_type, is_read, created_at,
        sender:users!messages_sender_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw new ValidationException(error.message);
    return data;
  }

  async getUnreadCount(userId: string) {
    const { count } = await this.supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .neq('sender_id', userId);

    return { unread: count ?? 0 };
  }

  private async assertParticipant(conversationId: string, userId: string) {
    const { data } = await this.supabase
      .from('conversations')
      .select('id, user_a_id, user_b_id')
      .eq('id', conversationId)
      .single();

    if (!data) throw new NotFoundException('Cuộc hội thoại', conversationId);
    if (data.user_a_id !== userId && data.user_b_id !== userId) {
      throw new ForbiddenException('Bạn không tham gia cuộc hội thoại này');
    }
  }
}
