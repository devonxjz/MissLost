import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../config/supabase.config';
import { CreateStorageItemDto, ClaimStorageItemDto } from './dto/storage.dto';
import { NotFoundException, ValidationException } from '../../common/exceptions/app.exception';

@Injectable()
export class StorageService {
  private get supabase() {
    return getSupabaseClient();
  }

  async getLocations() {
    const { data } = await this.supabase
      .from('storage_locations')
      .select('*')
      .eq('is_active', true)
      .order('campus');
    return data ?? [];
  }

  async getItems(locationId?: string) {
    let q = this.supabase
      .from('storage_items')
      .select(`
        id, item_code, status, stored_at, discard_after,
        found_posts(id, title, image_urls, item_categories(name, icon_name)),
        storage_locations(id, name, campus)
      `)
      .order('stored_at', { ascending: false });

    if (locationId) q = q.eq('storage_location_id', locationId);

    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  }

  async getItem(id: string) {
    const { data, error } = await this.supabase
      .from('storage_items')
      .select(`
        *,
        found_posts(*, users!found_posts_user_id_fkey(full_name, email)),
        storage_locations(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Vật phẩm kho', id);
    return data;
  }

  async createItem(dto: CreateStorageItemDto, staffId: string) {
    // Check item_code unique
    const { data: existing } = await this.supabase
      .from('storage_items')
      .select('id')
      .eq('item_code', dto.item_code)
      .maybeSingle();

    if (existing) throw new ValidationException(`Mã vật phẩm "${dto.item_code}" đã tồn tại`);

    const { data, error } = await this.supabase
      .from('storage_items')
      .insert({ ...dto, submitted_by: staffId, received_by: staffId })
      .select('*')
      .single();

    if (error) throw new ValidationException(error.message);

    // Update found_post is_in_storage = true
    await this.supabase
      .from('found_posts')
      .update({ is_in_storage: true, storage_item_id: data.id })
      .eq('id', dto.found_post_id);

    return data;
  }

  async claimItem(id: string, dto: ClaimStorageItemDto, userId: string) {
    const item = await this.getItem(id);
    if (item.status !== 'stored') {
      throw new ValidationException('Vật phẩm này không ở trạng thái có thể nhận');
    }

    const { data, error } = await this.supabase
      .from('storage_items')
      .update({
        status: 'claimed',
        claimed_by: userId,
        claimed_at: new Date().toISOString(),
        claim_notes: dto.claim_notes,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new ValidationException(error.message);
    return data;
  }

  async searchByCode(code: string) {
    const { data, error } = await this.supabase
      .from('storage_items')
      .select(`
        *,
        found_posts(title, image_urls),
        storage_locations(name, campus, contact_phone)
      `)
      .ilike('item_code', `%${code}%`)
      .limit(10);

    if (error) throw error;
    return data ?? [];
  }
}
