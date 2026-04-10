/**
 * Supabase anonymous (browser-like) client dùng cho NestJS backend.
 * Sử dụng @supabase/supabase-js thay vì @supabase/ssr (Next.js specific).
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let anonClient: SupabaseClient | null = null;

export function getAnonClient(): SupabaseClient {
  if (!anonClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY env variables');
    }
    anonClient = createClient(url, key, { auth: { persistSession: false } });
  }
  return anonClient;
}