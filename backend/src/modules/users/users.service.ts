import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getSupabaseClient } from '../../config/supabase.config';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { NotFoundException } from '../../common/exceptions/app.exception';

@Injectable()
export class UsersService {
  private get supabase() {
    return getSupabaseClient();
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, full_name, email, student_id, phone, avatar_url, role, status, training_points, created_at, bio')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Người dùng', id);
    return data;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const updateData: any = { ...dto };
    if (dto.password) {
      updateData.password_hash = await bcrypt.hash(dto.password, 12);
      delete updateData.password;
    }

    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, full_name, email, phone, avatar_url, role, status, training_points, bio')
      .single();

    if (error || !data) throw new NotFoundException('Người dùng', id);
    return data;
  }

  async getUserPosts(userId: string) {
    const supabase = this.supabase;

    const [{ data: lostPosts }, { data: foundPosts }] = await Promise.all([
      supabase
        .from('lost_posts')
        .select('id, title, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('found_posts')
        .select('id, title, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    ]);

    return { lost_posts: lostPosts ?? [], found_posts: foundPosts ?? [] };
  }

  async getTrainingHistory(userId: string) {
    const { data } = await this.supabase
      .from('training_point_logs')
      .select('*, handovers(id, completed_at)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data ?? [];
  }

  // Admin: list all users
  async findAll(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase
      .from('users')
      .select('id, full_name, email, role, status, training_points, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      data: data ?? [],
      meta: { page, limit, total: count ?? 0 },
    };
  }

  // Admin: suspend / activate user
  async updateStatus(id: string, status: 'active' | 'suspended') {
    const { data, error } = await this.supabase
      .from('users')
      .update({ status })
      .eq('id', id)
      .select('id, email, status')
      .single();

    if (error || !data) throw new NotFoundException('Người dùng', id);
    return data;
  }
}
