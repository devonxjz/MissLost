import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../config/supabase.config';
import { CreateLostPostDto } from './dto/create-lost-post.dto';
import { UpdateLostPostDto } from './dto/update-lost-post.dto';
import { QueryLostPostsDto } from './dto/query-lost-posts.dto';
import { ReviewPostDto } from './dto/review-post.dto';
import {
  NotFoundException,
  ForbiddenException,
  ValidationException,
} from '../../common/exceptions/app.exception';

@Injectable()
export class LostPostsService {
  private get supabase() {
    return getSupabaseClient();
  }

  async create(dto: CreateLostPostDto, userId: string) {
    const { data, error } = await this.supabase
      .from('lost_posts')
      .insert({
        ...dto,
        user_id: userId,
        status: 'approved',
      })
      .select('*')
      .single();

    if (error) throw new ValidationException(error.message);

    // Log status history
    await this.supabase.from('post_status_history').insert({
      post_type: 'lost',
      post_id: data.id,
      old_status: null,
      new_status: 'approved',
      changed_by: userId,
      note: 'Bài đăng mới tạo',
    });

    return data;
  }

  async findAll(query: QueryLostPostsDto) {
    const { status = 'approved', category_id, search, page = 1, limit = 20 } = query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let q = this.supabase
      .from('lost_posts')
      .select(`
        id, title, description, location_lost, time_lost, image_urls, status,
        is_urgent, reward_note, view_count, created_at,
        users!lost_posts_user_id_fkey(full_name, avatar_url),
        item_categories(name, icon_name)
      `, { count: 'exact' })
      .eq('status', status)
      .order('is_urgent', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (category_id) q = q.eq('category_id', category_id);
    if (search) q = q.ilike('title', `%${search}%`);

    const { data, error, count } = await q;
    if (error) throw error;

    return {
      data: data ?? [],
      meta: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
    };
  }

  async findMyPosts(userId: string) {
    const { data, error } = await this.supabase
      .from('lost_posts')
      .select('id, title, status, created_at, is_urgent, category_id, item_categories(name, icon_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('lost_posts')
      .select(`
        *,
        users!lost_posts_user_id_fkey(id, full_name, avatar_url, student_id),
        item_categories(id, name, icon_name)
      `)
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Bài đăng mất đồ', id);

    // Increment view count (fire and forget)
    this.supabase.from('lost_posts').update({ view_count: (data.view_count ?? 0) + 1 }).eq('id', id);

    return data;
  }

  async update(id: string, dto: UpdateLostPostDto, userId: string, userRole: string) {
    const existing = await this.findOne(id);

    if (existing.user_id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('Bạn chỉ có thể chỉnh sửa bài của chính mình');
    }

    if (!['pending', 'approved'].includes(existing.status) && userRole !== 'admin') {
      throw new ForbiddenException('Không thể chỉnh sửa bài đã kết thúc');
    }

    const { data, error } = await this.supabase
      .from('lost_posts')
      .update(dto)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new ValidationException(error.message);
    return data;
  }

  async remove(id: string, userId: string, userRole: string) {
    const existing = await this.findOne(id);

    if (existing.user_id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('Bạn chỉ có thể xóa bài của chính mình');
    }

    const { error } = await this.supabase.from('lost_posts').delete().eq('id', id);
    if (error) throw new ValidationException(error.message);
    return { message: 'Đã xóa bài đăng' };
  }

  async adminReview(id: string, dto: ReviewPostDto, adminId: string) {
    const existing = await this.findOne(id);

    if (dto.action === 'rejected' && !dto.reason) {
      throw new ValidationException('Vui lòng cung cấp lý do từ chối');
    }

    const { data, error } = await this.supabase
      .from('lost_posts')
      .update({
        status: dto.action,
        rejection_reason: dto.action === 'rejected' ? dto.reason : null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new ValidationException(error.message);

    // Log status history
    await this.supabase.from('post_status_history').insert({
      post_type: 'lost',
      post_id: id,
      old_status: existing.status,
      new_status: dto.action,
      changed_by: adminId,
      note: dto.reason ?? null,
    });

    return data;
  }

  // Admin: get all pending posts
  async findPending() {
    const { data, error } = await this.supabase
      .from('lost_posts')
      .select(`
        id, title, description, image_urls, status, created_at,
        users!lost_posts_user_id_fkey(full_name, email),
        item_categories(name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }
}
