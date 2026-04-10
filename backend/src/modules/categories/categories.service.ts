import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../config/supabase.config';

@Injectable()
export class CategoriesService {
  private get supabase() {
    return getSupabaseClient();
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('item_categories')
      .select('id, name, icon_name, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from('item_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data;
  }
}
