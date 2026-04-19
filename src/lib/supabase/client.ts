// Supabase Client
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tyalbokyowdeskfrures.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 如果没有配置 key，返回 null
const isConfigured = !!supabaseUrl && !!supabaseAnonKey;

// 用于客户端（前端）- 使用 anon key
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// 检查是否配置成功
export const isSupabaseConfigured = isConfigured;

// 用于服务端操作 - 使用 service role key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const supabaseAdmin = serviceRoleKey 
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;