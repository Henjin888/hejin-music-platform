import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, supabaseAdmin, getCurrentUser, createProfile, createProjectRecord, getUserProjects, saveProjectResults } from "@/lib/supabase";

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
  coverImageUrl?: string;
}

interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;
  isGenerating: boolean;
  userId: string | null;
  isAuthenticated: boolean;
  
  // 初始化
  init: () => Promise<void>;
  
  // Actions
  createProject: (title: string, goal: string) => Promise<Project | null>;
  setCurrentProject: (id: string | null) => void;
  updateProjectResults: (id: string, results: ProjectResults) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setGenerating: (status: boolean) => void;
  setUser: (userId: string) => void;
  logout: () => void;
  
  // Getters
  getCurrentProject: () => Project | null;
}

// 模拟数据（演示用）
const mockResults: ProjectResults = {
  summary: {
    theme: "春天、爱情、美好",
    bpm: "120",
    key: "C Major",
    structure: "Intro → Verse1 → Pre-Chorus → Chorus → Verse2 → Bridge → Chorus → Outro",
    hook: "春天的风，吹进我心里",
  },
  lyrics: `Verse 1:
阳光洒落在这条小路
微风吹过你的笑容
春天的花开的刚刚好
就像我们的相遇

Pre-Chorus:
这一刻 时间好像停止
心跳却越来越快
我知道 这是命运的安排

Chorus:
春天的风 吹进我心里
带着你的温柔和甜蜜
无论未来有多遥远
我们都手牵手一起走`,
  sunoPrompt: `[Verse]
Upbeat pop, synthesizers, dreamy vocals
Sunny spring day, romantic atmosphere
Light acoustic guitar, ukulele

[Chorus]
Catchy melody, powerful drums
Emotional build, hopeful ending
Synth strings, summer vibes

[Bridge]
Soft piano, stripped down
Return with full band, climax`,
  coverPrompt: `A girl in flowing pink dress, cherry blossoms in background, soft natural lighting, spring atmosphere, dreamy aesthetic, pastel colors`,
  shortsScript: `0-3s: 开场特效 + "春天来了"
3-15s: 主歌画面 + 歌词字幕
15-30s: 副歌 + 舞蹈
30-45s: 结尾 CTA + "完整版在评论区"`,
  releaseCopy: `🎵 新歌《春天的风》上线！

春天来了，爱情也来了～ 这是一首关于美好相遇的歌🎶

#新歌 #春天 #流行 #抖音
完整版 🔗 [链接]`,
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      isGenerating: false,
      userId: null,
      isAuthenticated: false,

      init: async () => {
        try {
          const user = await getCurrentUser();
          if (user) {
            set({ userId: user.id, isAuthenticated: true });
            // 从数据库加载项目
            const projects = await getUserProjects(user.id);
            set({ projects });
          }
        } catch (e) {
          console.error("init error:", e);
        }
      },

      createProject: async (title, goal) => {
        const { userId } = get();
        if (!userId) {
          // 未登录时使用模拟数据
          const project: Project = {
            id: Date.now().toString(),
            user_id: "demo",
            title,
            goal,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          set((state) => ({
            projects: [project, ...state.projects],
            currentProjectId: project.id,
          }));
          return project;
        }
        
        try {
          const project = await createProjectRecord(userId, title, goal);
          const newProject: Project = {
            id: project.id,
            user_id: project.user_id,
            title: project.title,
            goal: project.goal,
            status: project.status,
            created_at: project.created_at,
            updated_at: project.updated_at,
          };
          set((state) => ({
            projects: [newProject, ...state.projects],
            currentProjectId: newProject.id,
          }));
          return newProject;
        } catch (e) {
          console.error("createProject error:", e);
          return null;
        }
      },

      setCurrentProject: (id) => set({ currentProjectId: id }),

      updateProjectResults: async (id, results) => {
        const { userId } = get();
        
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, results, updated_at: new Date().toISOString() }
              : p
          ),
        }));
        
        // 保存到数据库（如果已登录）
        if (userId) {
          try {
            await saveProjectResults(id, "full", results);
          } catch (e) {
            console.error("saveProjectResults error:", e);
          }
        }
      },

      archiveProject: async (id) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, status: "archived" as const } : p
          ),
        }));
      },

      deleteProject: async (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId:
            state.currentProjectId === id ? null : state.currentProjectId,
        }));
      },

      setGenerating: (status) => set({ isGenerating: status }),

      setUser: (userId) => set({ userId, isAuthenticated: !!userId }),

      logout: () => set({ userId: null, isAuthenticated: false, projects: [], currentProjectId: null }),

      getCurrentProject: () => {
        const state = get();
        return state.projects.find((p) => p.id === state.currentProjectId) || null;
      },
    }),
    {
      name: "vocalos-projects",
    }
  )
);