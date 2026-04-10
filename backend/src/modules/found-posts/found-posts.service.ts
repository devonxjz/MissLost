import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../config/supabase.config';
import { CreateFoundPostDto } from './dto/create-found-post.dto';
import { UpdateFoundPostDto } from './dto/update-found-post.dto';
import { QueryFoundPostsDto } from './dto/query-found-posts.dto';
import { ReviewPostDto } from '../lost-posts/dto/review-post.dto';
import {
  NotFoundException,
  ForbiddenException,
  ValidationException,
} from '../../common/exceptions/app.exception';

@Injectable()
export class FoundPostsService {
  private get supabase() {
    return getSupabaseClient();
  }

  async create(dto: CreateFoundPostDto, userId: string) {
    const { data, error } = await this.supabase
      .from('found_posts')
      .insert({ ...dto, user_id: userId, status: 'pending' })
      .select('*')
      .single();

    if (error) throw new ValidationException(error.message);

    await this.supabase.from('post_status_history').insert({
      post_type: 'found',
      post_id: data.id,
      old_status: null,
      new_status: 'pending',
      changed_by: userId,
      note: 'Bài đăng mới tạo',
    });

    return data;
  }

  async findAll(query: QueryFoundPostsDto) {
    const { status = 'approved', category_id, search, page = 1, limit = 20 } = query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let q = this.supabase
      .from('found_posts')
      .select(`
        id, title, description, location_found, time_found, image_urls,
        status, is_in_storage, view_count, created_at,
        users!found_posts_user_id_fkey(full_name, avatar_url),
        item_categories(name, icon_name)
      `, { count: 'exact' })
      .eq('status', status)
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
      .from('found_posts')
      .select('id, title, status, created_at, item_categories(name, icon_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('found_posts')
      .select(`
        *,
        users!found_posts_user_id_fkey(id, full_name, avatar_url, student_id),
        item_categories(id, name, icon_name)
      `)
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Bài đăng nhặt được', id);
    this.supabase.from('found_posts').update({ view_count: (data.view_count ?? 0) + 1 }).eq('id', id);
    return data;
  }

  async update(id: string, dto: UpdateFoundPostDto, userId: string, userRole: string) {
    const existing = await this.findOne(id);
    if (existing.user_id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('Bạn chỉ có thể chỉnh sửa bài của chính mình');
    }
    const { data, error } = await this.supabase
      .from('found_posts').update(dto).eq('id', id).select('*').single();
    if (error) throw new ValidationException(error.message);
    return data;
  }

  async remove(id: string, userId: string, userRole: string) {
    const existing = await this.findOne(id);
    if (existing.user_id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('Bạn chỉ có thể xóa bài của chính mình');
    }
    const { error } = await this.supabase.from('found_posts').delete().eq('id', id);
    if (error) throw new ValidationException(error.message);
    return { message: 'Đã xóa bài đăng' };
  }

  async adminReview(id: string, dto: ReviewPostDto, adminId: string) {
    const existing = await this.findOne(id);
    if (dto.action === 'rejected' && !dto.reason) {
      throw new ValidationException('Vui lòng cung cấp lý do từ chối');
    }

    const { data, error } = await this.supabase
      .from('found_posts')
      .update({
        status: dto.action,
        rejection_reason: dto.action === 'rejected' ? dto.reason : null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id).select('*').single();

    if (error) throw new ValidationException(error.message);

    await this.supabase.from('post_status_history').insert({
      post_type: 'found',
      post_id: id,
      old_status: existing.status,
      new_status: dto.action,
      changed_by: adminId,
      note: dto.reason ?? null,
    });

    return data;
  }

  async findPending() {
    const { data, error } = await this.supabase
      .from('found_posts')
      .select(`
        id, title, description, image_urls, status, created_at, is_in_storage,
        users!found_posts_user_id_fkey(full_name, email),
        item_categories(name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }
}
