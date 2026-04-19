"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectStore, type Project, type ProjectResults } from "@/stores/project-store";
import { generateResults, isAIConfigured } from "@/lib/openai";
import { generateCoverImage } from "@/lib/ai-service";
import { 
  Music2, 
  PenLine, 
  Image, 
  Video, 
  Send,
  RefreshCcw,
  Plus,
  Download,
  FolderOpen,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateTxtExport, generateMdExport } from "@/lib/ai-service";

const resultTypes = [
  { key: "summary", icon: Sparkles, label: "摘要", color: "text-[#00ff7f] bg-[#00ff7f]/10" },
  { key: "lyrics", icon: PenLine, label: "歌词方向", color: "text-[#00ff7f] bg-[#00ff7f]/10" },
  { key: "sunoPrompt", icon: Music2, label: "Suno提示词", color: "text-[#00ff7f] bg-[#00ff7f]/10" },
  { key: "coverPrompt", icon: Image, label: "封面提示词", color: "text-[#00ff7f] bg-[#00ff7f]/10" },
  { key: "shortsScript", icon: Video, label: "Shorts脚本", color: "text-[#00ff7f] bg-[#00ff7f]/10" },
  { key: "releaseCopy", icon: Send, label: "发布文案", color: "text-[#00ff7f] bg-[#00ff7f]/10" },
];

function formatContent(results: ProjectResults | undefined, key: string): string {
  if (!results) return "";
  const value = results[key as keyof ProjectResults];
  if (!value) return "";
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  }
  return value;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function WorkspacePage() {
  const [goal, setGoal] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const router = useRouter();
  
  const { 
    projects, 
    currentProjectId, 
    isGenerating,
    createProject,
    setCurrentProject,
    updateProjectResults,
    setGenerating,
    getCurrentProject
  } = useProjectStore();

  const currentProject = getCurrentProject();

  const handleCopy = (text: string, key: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateProject = async () => {
    if (!goal.trim()) return;
    
    const project = await createProject(goal.slice(0, 20), goal);
    if (!project) return;
    
    setGoal("");
    
    setGenerating(true);
    
    try {
      let results: ProjectResults;
      
      if (isAIConfigured) {
        // 调用真实 AI
        const aiResults = await generateResults(project.goal);
        results = aiResults as ProjectResults;
        
        // 可选：生成封面图片
        if (results.coverPrompt) {
          const coverUrl = await generateCoverImage(results.coverPrompt);
          if (coverUrl) {
            results.coverImageUrl = coverUrl;
          }
        }
      } else {
        // 模拟数据
        await new Promise((resolve) => setTimeout(resolve, 1500));
        results = {
          summary: {
            theme: "春天、爱情、美好",
            bpm: "120",
            key: "C Major",
            structure: "Intro → Verse1 → Pre-Chorus → Chorus → Verse2 → Bridge → Chorus → Outro",
            hook: "春天的风，吹进我心里",
          },
          lyrics: `Verse 1:\n阳光洒落在这条小路\n微风吹过你的笑容\n春天的花开的刚刚好\n\nPre-Chorus:\n这一刻时间好像停止\n心跳却越来越快\n\nChorus:\n春天的风吹进我心里\n带着你的温柔和甜蜜`,
          sunoPrompt: `[Verse]\nUpbeat pop, synthesizers, dreamy vocals\n\n[Chorus]\nCatchy melody, powerful drums\n\n[Bridge]\nSoft piano, stripped down`,
          coverPrompt: `A girl in flowing pink dress, cherry blossoms, soft natural lighting, spring atmosphere`,
          shortsScript: `0-3s: 开场特效 + "春天来了"\n3-15s: 主歌画面 + 歌词字幕\n15-30s: 副歌 + 舞蹈\n30-45s: 结尾 CTA`,
          releaseCopy: `🎵 新歌《春天的风》上线！\n\n#新歌 #春天 #流行`,
        };
      }
      
      updateProjectResults(project.id, results);
    } catch (error) {
      console.error("生成失败:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!currentProject) return;
    setGenerating(true);
    try {
      if (isAIConfigured) {
        const results = await generateResults(currentProject.goal);
        updateProjectResults(currentProject.id, results as ProjectResults);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error("重做失败:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = () => {
    if (!currentProject?.results) return;
    
    const txt = generateTxtExport({
      summary: currentProject.results.summary,
      lyrics: currentProject.results.lyrics,
      sunoPrompt: currentProject.results.sunoPrompt,
      coverPrompt: currentProject.results.coverPrompt,
      shortsScript: currentProject.results.shortsScript,
      releaseCopy: currentProject.results.releaseCopy,
    });
    
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.title}.txt`;
    a.click();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0d1a14]">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 */}
        <aside className="w-64 flex-shrink-0 border-r border-[#233828] bg-[#141f19]/50">
          <div className="flex h-14 items-center justify-between border-b border-[#233828] px-4">
            <span className="font-semibold text-[#e6f0e8]">我的项目</span>
          </div>
          
          <div className="overflow-y-auto p-2">
            {projects.length === 0 ? (
              <div className="p-4 text-center text-sm text-[#809080]">
                暂无项目
              </div>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setCurrentProject(project.id)}
                  className={cn(
                    "w-full rounded-lg p-3 text-left transition-all",
                    currentProject?.id === project.id
                      ? "bg-[#00ff7f]/10 text-[#00ff7f]"
                      : "text-[#e6f0e8] hover:bg-[#1a3323]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{project.title}</span>
                    {project.status === "archived" && (
                      <FolderOpen className="h-4 w-4" />
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-[#809080]">
                    {new Date(project.updated_at).toLocaleDateString("zh-CN")}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>
        
        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {/* 目标输入 */}
            <Card className="mb-6 border-[#233828] bg-gradient-to-r from-[#00ff7f]/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Input
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="输入新的创作目标..."
                    className="flex-1 bg-[#141f19] border-[#233828] text-[#e6f0e8]"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                  />
                  <Button 
                    onClick={handleCreateProject}
                    loading={isGenerating}
                    disabled={!goal.trim()}
                    className="bg-[#00ff7f] text-[#003d1f] hover:bg-[#00cc66]"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isGenerating ? "生成中..." : "生成"}
                  </Button>
                </div>
                
                {!isAIConfigured && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#809080]">
                    <AlertCircle className="h-3 w-3" />
                    <span>AI 未配置，使用模拟数据</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* 生成中状态 */}
            {isGenerating && (
              <Card className="mb-6 border-[#00ff7f]/20 bg-[#00ff7f]/5">
                <CardContent className="p-6 text-center">
                  <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#00ff7f]" />
                  <p className="font-medium text-[#e6f0e8]">AI 正在创作中...</p>
                  <p className="mt-1 text-sm text-[#809080]">
                    解析目标 → 生成歌词 → 生成提示词...
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* 结果展示 */}
            {!isGenerating && currentProject?.results && (
              <div className="grid gap-4 md:grid-cols-2">
                {resultTypes.map((type) => {
                  const content = formatContent(currentProject.results, type.key);
                  return (
                    <Card key={type.key} className="overflow-hidden border-[#233828] bg-[#141f19]">
                      <div className={cn("flex items-center gap-2 border-b border-[#233828] px-4 py-3", type.color)}>
                        <type.icon className="h-4 w-4" />
                        <span className="font-medium">{type.label}</span>
                        {copiedKey === type.key && (
                          <Check className="ml-auto h-3 w-3" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <pre className="whitespace-pre-wrap text-sm text-[#809080] font-normal max-h-48 overflow-y-auto">
                          {content}
                        </pre>
                      </CardContent>
                      <div className="flex gap-2 border-t border-[#233828] px-4 py-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleCopy(content, type.key)}
                          className="border-[#233828] text-[#e6f0e8] hover:bg-[#1a3323]"
                        >
                          {copiedKey === type.key ? (
                            <Check className="mr-1 h-3 w-3" />
                          ) : (
                            <Copy className="mr-1 h-3 w-3" />
                          )}
                          {copiedKey === type.key ? "已复制" : "复制"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleRegenerate}
                          className="border-[#233828] text-[#e6f0e8] hover:bg-[#1a3323]"
                        >
                          <RefreshCcw className="mr-1 h-3 w-3" />
                          重做
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {/* 空状态 */}
            {!isGenerating && !currentProject?.results && (
              <Card className="p-12 text-center border-[#233828] bg-[#141f19]">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#1a3323] flex items-center justify-center">
                  <Music2 className="h-6 w-6 text-[#809080]" />
                </div>
                <p className="font-medium text-[#e6f0e8]">开始你的第一个创作</p>
                <p className="mt-1 text-sm text-[#809080]">
                  输入创作目标，AI 会自动生成完整的音乐包装
                </p>
              </Card>
            )}
            
            {/* 导出按钮 */}
            {!isGenerating && currentProject?.results && (
              <div className="mt-6 flex justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={handleExport}
                  className="bg-[#00ff7f] text-[#003d1f] hover:bg-[#00cc66]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  导出 TXT
                </Button>
              </div>
            )}
          </div>
        </main>
        
        {/* 右侧栏 */}
        <aside className="w-56 flex-shrink-0 border-l border-[#233828] bg-[#141f19]/50 p-4">
          <div className="rounded-lg bg-[#1a3323] p-4">
            <div className="mb-3 text-sm text-[#809080]">当前套餐</div>
            <div className="mb-3 font-semibold text-[#00ff7f]">免费版</div>
            <div className="mb-3 text-sm">
              <div className="flex justify-between text-[#809080]">
                <span>项目数</span>
                <span>{projects.length} / 3</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#0d1a14]">
                <div 
                  className="h-full bg-[#00ff7f]" 
                  style={{ width: `${Math.min(100, (projects.length / 3) * 100)}%` }} 
                />
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full bg-[#00ff7f] text-[#003d1f] hover:bg-[#00cc66]"
            >
              升级到 Pro
            </Button>
          </div>
          
          <div className="mt-4 rounded-lg bg-[#1a3323] p-4">
            <a href="/account" className="flex items-center gap-2 text-sm text-[#e6f0e8] hover:text-[#00ff7f] cursor-pointer">
              账户中心
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}