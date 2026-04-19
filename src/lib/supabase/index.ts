// VocalOS - 用户认证与数据持久化
// 使用 Supabase Auth + Database

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const supabaseUrl = "https://tyalbokyowdeskfrures.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// 创建客户端
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

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
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

// ============ 数据库操作 ============

export async function createProfile(userId: string, email: string, nickname?: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .insert({ id: userId, email, nickname })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getProfile(userId: string): Promise<Profile | null> {
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
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({ user_id: userId, title, goal })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
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
  const { data, error } = await supabaseAdmin
    .from("project_results")
    .insert({ project_id: projectId, result_type: resultType, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getProjectResults(projectId: string): Promise<ProjectResultRecord[]> {
  const { data, error } = await supabase
    .from("project_results")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function updateProjectStatus(projectId: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single();
  if (error) throw error;
  return data;
}