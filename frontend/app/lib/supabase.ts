import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Hàm khởi tạo Supabase Client tuỳ chỉnh cho từng user request mà không gây cảnh báo multiple Auth intances.
export const getSupabase = (token?: string | null) => {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,     // Tắt tự lưu session vào cache để tránh conflict warning
      autoRefreshToken: false,   // Tắt tự renew (vì fetch token từ localStorage cục bộ)
    },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
};
