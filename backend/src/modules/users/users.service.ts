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
      .select('id, user_id, points_delta, reason, balance_after, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data ?? [];
  }

  async getTrainingScore(userId: string) {
    // Fetch user profile + training logs in parallel
    const [userResult, logsResult, triggersResult] = await Promise.all([
      this.supabase
        .from('users')
        .select('id, full_name, avatar_url, training_points, created_at')
        .eq('id', userId)
        .single(),
      this.supabase
        .from('training_point_logs')
        .select('id, points_delta, reason, balance_after, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
      this.supabase
        .from('triggers')
        .select('id', { count: 'exact' })
        .or(`finder_user_id.eq.${userId},target_user_id.eq.${userId}`)
        .eq('status', 'confirmed'),
    ]);

    if (userResult.error || !userResult.data) {
      throw new NotFoundException('Người dùng', userId);
    }

    return {
      user: userResult.data,
      logs: logsResult.data ?? [],
      stats: {
        total_points: userResult.data.training_points ?? 0,
        total_handovers: triggersResult.count ?? 0,
      },
    };
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

  // Admin: training points list with search & sort
  async getTrainingPointsAdmin(page = 1, limit = 20, search?: string, sort: 'asc' | 'desc' = 'desc') {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let q = this.supabase
      .from('users')
      .select('id, full_name, email, avatar_url, role, status, training_points, created_at', { count: 'exact' })
      .order('training_points', { ascending: sort === 'asc' });

    if (search) {
      q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await q.range(from, to);
    if (error) throw error;

    return {
      data: data ?? [],
      meta: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
    };
  }

  // Admin: adjust training points manually
  async adjustTrainingPoints(userId: string, points: number, reason: string) {
    const { data: user, error: userErr } = await this.supabase
      .from('users')
      .select('id, training_points')
      .eq('id', userId)
      .single();

    if (userErr || !user) throw new NotFoundException('Người dùng', userId);

    const newBalance = (user.training_points ?? 0) + points;

    const { error: updateErr } = await this.supabase
      .from('users')
      .update({ training_points: newBalance })
      .eq('id', userId);

    if (updateErr) throw updateErr;

    // Log the change
    await this.supabase.from('training_point_logs').insert({
      user_id: userId,
      points_delta: points,
      reason: reason || 'Admin điều chỉnh',
      balance_after: newBalance,
    });

    return { id: userId, training_points: newBalance, points_delta: points, reason };
  }

  // Admin: all training point logs
  async getTrainingLogsAdmin(page = 1, limit = 30) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase
      .from('training_point_logs')
      .select('id, user_id, points_delta, reason, balance_after, created_at, users!training_point_logs_user_id_fkey(full_name, email, avatar_url)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data ?? [],
      meta: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
    };
  }
}
