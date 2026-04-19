// Supabase Client
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tyalbokyowdeskfrures.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// 用于客户端（前端）- 使用 anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// 检查是否配置成功
export const isSupabaseConfigured = !!supabase && !!serviceRoleKey;

// 用于服务端操作 - 使用 service role key
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});