// Supabase 数据库操作
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tyalbokyowdeskfrures.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = (supabaseAnonKey && serviceRoleKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    })
  : null;

export const isSupabaseConfigured = !!supabase && !!serviceRoleKey;

// ============ 数据库操作函数 ============

// 创建项目
export async function createProject(userId: string, title: string, goal: string) {
  if (!supabase || !serviceRoleKey) return null;
  
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      title,
      goal,
      status: "active",
    })
    .select()
    .single();
    
  if (error) {
    console.error("createProject error:", error);
    return null;
  }
  return data;
}

// 获取用户所有项目
export async function getUserProjects(userId: string) {
  if (!supabase || !serviceRoleKey) return [];
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("getUserProjects error:", error);
    return [];
  }
  return data || [];
}

// 保存项目结果
export async function saveProjectResults(
  projectId: string, 
  resultType: string, 
  content: object
) {
  if (!supabase || !serviceRoleKey) return null;
  
  const { data, error } = await supabase
    .from("project_results")
    .insert({
      project_id: projectId,
      result_type: resultType,
      content,
    })
    .select()
    .single();
    
  if (error) {
    console.error("saveProjectResults error:", error);
    return null;
  }
  return data;
}

// 获取项目结果
export async function getProjectResults(projectId: string) {
  if (!supabase || !serviceRoleKey) return [];
  
  const { data, error } = await supabase
    .from("project_results")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("getProjectResults error:", error);
    return [];
  }
  return data || [];
}

// 更新项目
export async function updateProject(projectId: string, updates: object) {
  if (!supabase || !serviceRoleKey) return null;
  
  const { data, error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single();
    
  if (error) {
    console.error("updateProject error:", error);
    return null;
  }
  return data;
}

// 删除项目
export async function deleteProject(projectId: string) {
  if (!supabase || !serviceRoleKey) return false;
  
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);
    
  if (error) {
    console.error("deleteProject error:", error);
    return false;
  }
  return true;
}