// VocalOS - 用户认证与数据持久化
// 使用 Supabase Auth + Database

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tyalbokyowdeskfrures.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// 如果没有配置 key，返回 null
const isConfigured = !!supabaseUrl && !!supabaseAnonKey;

// 创建客户端
export const supabase: SupabaseClient | null = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const supabaseAdmin = serviceRoleKey 
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;

// ============ 类型定义 ============

export interface Profile {
  id: string;
  email: string;
  nickname?: string;
  plan: string;
  project_quota: number;
  export_quota: number;
  used_projects: number;
  used_exports: number;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  goal: string;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
  results?: ProjectResults;
}

export interface ProjectResults {
  summary?: { theme: string; bpm: string; key: string; structure: string; hook: string };
  lyrics?: string;
  sunoPrompt?: string;
  coverPrompt?: string;
  shortsScript?: string;
  releaseCopy?: string;
}

export interface ProjectResultRecord {
  id: string;
  project_id: string;
  result_type: string;
  content: any;
  created_at: string;
}

// ============ 认证函数 ============

export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

// ============ 数据库操作 ============

export async function createProfile(userId: string, email: string, nickname?: string) {
  if (!supabaseAdmin) throw new Error("Supabase not configured");
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .insert({ id: userId, email, nickname })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

// 项目操作
export async function createProjectRecord(userId: string, title: string, goal: string) {
  if (!supabaseAdmin) throw new Error("Supabase not configured");
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({ user_id: userId, title, goal })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function saveProjectResults(
  projectId: string,
  resultType: string,
  content: any
) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("project_results")
    .insert({ project_id: projectId, result_type: resultType, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getProjectResults(projectId: string): Promise<ProjectResultRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("project_results")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function updateProjectStatus(projectId: string, status: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single();
  if (error) throw error;
  return data;
}