import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../config/supabase.config';
import { NotFoundException, ForbiddenException, ValidationException } from '../../common/exceptions/app.exception';

@Injectable()
export class AiMatchesService {
  private get supabase() {
    return getSupabaseClient();
  }

  /**
   * Tìm found posts khớp với lost post theo category + từ khóa trong title/description
   * (text-based matching, không cần YOLO)
   */
  async findMatches(lostPostId: string) {
    const supabase = this.supabase;

    // Lấy thông tin lost post
    const { data: lostPost, error: lpErr } = await supabase
      .from('lost_posts')
      .select('id, title, description, category_id, time_lost')
      .eq('id', lostPostId)
      .single();

    if (lpErr || !lostPost) throw new NotFoundException('Bài mất đồ', lostPostId);

    // Lấy matches đã lưu
    const { data: existingMatches } = await supabase
      .from('ai_matches')
      .select(`
        id, similarity_score, text_score, match_method, status,
        confirmed_by_owner, confirmed_by_finder, created_at,
        found_posts(id, title, description, location_found, time_found, image_urls,
          users!found_posts_user_id_fkey(full_name))
      `)
      .eq('lost_post_id', lostPostId)
      .order('similarity_score', { ascending: false });

    return existingMatches ?? [];
  }

  /**
   * Chạy text-similarity matching giữa lost post và found posts cùng category
   */
  async runMatch(lostPostId: string) {
    const supabase = this.supabase;

    const { data: lostPost } = await supabase
      .from('lost_posts')
      .select('id, title, description, category_id')
      .eq('id', lostPostId)
      .single();

    if (!lostPost) throw new NotFoundException('Bài mất đồ', lostPostId);

    // Lấy found posts cùng category, đã approved
    let q = supabase
      .from('found_posts')
      .select('id, title, description, category_id')
      .eq('status', 'approved');

    if (lostPost.category_id) {
      q = q.eq('category_id', lostPost.category_id);
    }

    const { data: candidates } = await q;
    if (!candidates || candidates.length === 0) return { matched: 0 };

    const lostText = `${lostPost.title} ${lostPost.description}`.toLowerCase();

    const upserts: any[] = [];

    for (const fp of candidates) {
      const foundText = `${fp.title} ${fp.description}`.toLowerCase();
      const textScore = this.computeJaccardSimilarity(lostText, foundText);

      if (textScore > 0.1) {
        upserts.push({
          lost_post_id: lostPostId,
          found_post_id: fp.id,
          similarity_score: textScore,
          text_score: textScore,
          match_method: 'text_similarity',
          status: 'pending',
        });
      }
    }

    if (upserts.length > 0) {
      await supabase
        .from('ai_matches')
        .upsert(upserts, { onConflict: 'lost_post_id,found_post_id' });
    }

    return { matched: upserts.length };
  }

  /**
   * Xác nhận match từ 1 phía (owner hoặc finder)
   */
  async confirmMatch(matchId: string, userId: string, side: 'owner' | 'finder') {
    const supabase = this.supabase;

    const { data: match, error } = await supabase
      .from('ai_matches')
      .select('*, lost_posts(user_id), found_posts(user_id)')
      .eq('id', matchId)
      .single();

    if (error || !match) throw new NotFoundException('Match', matchId);

    // Verify user is the owner or finder
    if (side === 'owner' && match.lost_posts.user_id !== userId) {
      throw new ForbiddenException('Bạn không phải chủ bài đăng mất đồ này');
    }
    if (side === 'finder' && match.found_posts.user_id !== userId) {
      throw new ForbiddenException('Bạn không phải người đăng bài nhặt được này');
    }

    const update: Record<string, any> = {};
    if (side === 'owner') update.confirmed_by_owner = true;
    else update.confirmed_by_finder = true;

    // Both confirmed → mark as confirmed
    const ownerConfirmed = side === 'owner' ? true : match.confirmed_by_owner;
    const finderConfirmed = side === 'finder' ? true : match.confirmed_by_finder;

    if (ownerConfirmed && finderConfirmed) {
      update.status = 'confirmed';
    }

    const { data, err2 } = await supabase
      .from('ai_matches')
      .update(update)
      .eq('id', matchId)
      .select('*')
      .single() as any;

    if (err2) throw new ValidationException(err2.message);
    return data;
  }

  // Jaccard similarity để tính text score
  private computeJaccardSimilarity(a: string, b: string): number {
    const setA = new Set(a.split(/\s+/).filter(w => w.length > 2));
    const setB = new Set(b.split(/\s+/).filter(w => w.length > 2));

    const intersection = [...setA].filter(w => setB.has(w)).length;
    const union = new Set([...setA, ...setB]).size;

    if (union === 0) return 0;
    return parseFloat((intersection / union).toFixed(4));
  }

  // Admin: dashboard stats
  async getDashboardStats() {
    const supabase = this.supabase;

    const [totalUsers, activeLost, activeFound, pendingReview, totalHandovers, itemsInStorage] =
      await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user'),
        supabase.from('lost_posts').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('found_posts').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        Promise.all([
          supabase.from('lost_posts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('found_posts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ]),
        supabase.from('handovers').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('storage_items').select('*', { count: 'exact', head: true }).eq('status', 'stored'),
      ]);

    const [pendingLost, pendingFound] = pendingReview;

    return {
      total_users: totalUsers.count ?? 0,
      active_lost_posts: activeLost.count ?? 0,
      active_found_posts: activeFound.count ?? 0,
      pending_review: (pendingLost.count ?? 0) + (pendingFound.count ?? 0),
      total_handovers: totalHandovers.count ?? 0,
      items_in_storage: itemsInStorage.count ?? 0,
    };
  }

  // Admin: enhanced dashboard stats — status breakdown, trends, activity
  async getEnhancedDashboardStats() {
    const supabase = this.supabase;

    // --- Status breakdown for all posts ---
    const statusList = ['pending', 'approved', 'rejected', 'matched', 'closed'];
    const lostByStatus: Record<string, number> = {};
    const foundByStatus: Record<string, number> = {};

    await Promise.all(
      statusList.map(async (s) => {
        const [lr, fr] = await Promise.all([
          supabase.from('lost_posts').select('*', { count: 'exact', head: true }).eq('status', s),
          supabase.from('found_posts').select('*', { count: 'exact', head: true }).eq('status', s),
        ]);
        lostByStatus[s] = lr.count ?? 0;
        foundByStatus[s] = fr.count ?? 0;
      }),
    );

    // --- Total counts ---
    const totalLost = Object.values(lostByStatus).reduce((a, b) => a + b, 0);
    const totalFound = Object.values(foundByStatus).reduce((a, b) => a + b, 0);

    // --- Recent 10 posts (mixed lost+found) for activity feed ---
    const [recentLost, recentFound] = await Promise.all([
      supabase
        .from('lost_posts')
        .select('id, title, status, created_at, users!lost_posts_user_id_fkey(full_name, avatar_url), item_categories(name)')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('found_posts')
        .select('id, title, status, created_at, users!found_posts_user_id_fkey(full_name, avatar_url), item_categories(name)')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const recentPosts = [
      ...(recentLost.data ?? []).map((p: any) => ({ ...p, post_type: 'lost' })),
      ...(recentFound.data ?? []).map((p: any) => ({ ...p, post_type: 'found' })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

    // --- Top categories (from both tables) ---
    const [lostCats, foundCats] = await Promise.all([
      supabase.from('lost_posts').select('item_categories(name)').not('category_id', 'is', null),
      supabase.from('found_posts').select('item_categories(name)').not('category_id', 'is', null),
    ]);

    const catCount: Record<string, number> = {};
    [...(lostCats.data ?? []), ...(foundCats.data ?? [])].forEach((p: any) => {
      const name = p.item_categories?.name ?? 'Khác';
      catCount[name] = (catCount[name] ?? 0) + 1;
    });

    const topCategories = Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    // --- Recent handovers ---
    const { data: recentHandovers } = await supabase
      .from('handovers')
      .select('id, status, handover_location, completed_at, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // --- User stats ---
    const [activeUsers, suspendedUsers, pendingUsers] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'suspended'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'pending_verify'),
    ]);

    return {
      posts: {
        lost: { total: totalLost, by_status: lostByStatus },
        found: { total: totalFound, by_status: foundByStatus },
        total: totalLost + totalFound,
      },
      users: {
        active: activeUsers.count ?? 0,
        suspended: suspendedUsers.count ?? 0,
        pending_verify: pendingUsers.count ?? 0,
        total: (activeUsers.count ?? 0) + (suspendedUsers.count ?? 0) + (pendingUsers.count ?? 0),
      },
      recent_posts: recentPosts,
      top_categories: topCategories,
      recent_handovers: recentHandovers ?? [],
    };
  }

  // Admin: list all posts (lost + found) with filters and pagination
  async listAllPosts(filters: {
    type?: 'all' | 'lost' | 'found';
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const supabase = this.supabase;
    const { type = 'all', status, search, page = 1, limit = 20 } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const results: any[] = [];
    let totalCount = 0;

    if (type === 'all' || type === 'lost') {
      let q = supabase
        .from('lost_posts')
        .select(`
          id, title, description, location_lost, time_lost, image_urls, status,
          is_urgent, view_count, created_at,
          users!lost_posts_user_id_fkey(id, full_name, avatar_url),
          item_categories(name, icon_name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) q = q.eq('status', status);
      if (search) q = q.ilike('title', `%${search}%`);

      if (type === 'lost') {
        q = q.range(from, to);
      }

      const { data, count } = await q;
      const mapped = (data ?? []).map((p: any) => ({
        ...p,
        post_type: 'lost',
        location: p.location_lost,
        time_event: p.time_lost,
      }));
      results.push(...mapped);
      totalCount += count ?? 0;
    }

    if (type === 'all' || type === 'found') {
      let q = supabase
        .from('found_posts')
        .select(`
          id, title, description, location_found, time_found, image_urls, status,
          is_in_storage, view_count, created_at,
          users!found_posts_user_id_fkey(id, full_name, avatar_url),
          item_categories(name, icon_name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) q = q.eq('status', status);
      if (search) q = q.ilike('title', `%${search}%`);

      if (type === 'found') {
        q = q.range(from, to);
      }

      const { data, count } = await q;
      const mapped = (data ?? []).map((p: any) => ({
        ...p,
        post_type: 'found',
        location: p.location_found,
        time_event: p.time_found,
      }));
      results.push(...mapped);
      totalCount += count ?? 0;
    }

    // Sort merged results by created_at desc
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Apply pagination for "all" type
    const paginated = type === 'all' ? results.slice(from, to + 1) : results;

    return {
      data: paginated,
      meta: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
