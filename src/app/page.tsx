"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Music2, 
  Sparkles, 
  Image, 
  Video, 
  PenLine, 
  ArrowRight,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

const examples = [
  {
    icon: Music2,
    text: "写一首关于春天的流行歌，适合抖音发布",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: PenLine,
    text: "创作一首关于友情的歌词，温馨感人",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Sparkles,
    text: "生成一首电子风格的夜间舞曲",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

const features = [
  {
    icon: PenLine,
    title: "歌词方向",
    description: "AI 理解你的目标，自动生成歌词方向、Hook 和桥段建议",
  },
  {
    icon: Music2,
    title: "Suno 提示词",
    description: "生成可直接用于 Suno 的 A/B/C 三版本提示词",
  },
  {
    icon: Image,
    title: "封面提示词",
    description: "生成专业封面和竖版缩略图的视觉提示",
  },
  {
    icon: Video,
    title: "Shorts 脚本",
    description: "生成短视频脚本与镜头节奏规划",
  },
];

export default function HomePage() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    // TODO: Create project and redirect
    router.push("/workspace");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-primary/20 via-primary/10 to-transparent blur-3xl" />
          <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute left-0 bottom-1/4 w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>输入目标，自动生成完整音乐包装</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground via-primary to-violet-500 bg-clip-text text-transparent">
                你的音乐想法
              </span>
              <br />
              <span className="text-foreground">一键变成作品</span>
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              不需要懂音乐技术，不用分别找人做词、曲、封面、视频
              <br className="hidden md:block" />
              只需说出你的想法，VocalOS 自动生成完整交付包
            </p>

            {/* Goal Input */}
            <div className="mx-auto mb-8 max-w-2xl">
              <div className="relative">
                <Input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="输入你的音乐想法，比如：写一首关于夏天的流行歌..."
                  className="h-16 text-lg pr-32 bg-white/80 backdrop-blur shadow-lg shadow-primary/10 border-primary/20"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={!goal.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  size="lg"
                >
                  开始创作
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Example Cards */}
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              <span className="text-sm text-muted-foreground">试试：</span>
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setGoal(example.text)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-sm transition-all hover:border-primary/50 hover:bg-accent",
                    example.bg
                  )}
                >
                  <example.icon className={cn("h-4 w-4", example.color)} />
                  <span>{example.text}</span>
                </button>
              ))}
            </div>

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <Card key={i} className="border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors">
                  <CardContent className="p-4">
                    <feature.icon className="mb-2 h-5 w-5 text-primary" />
                    <h3 className="mb-1 font-semibold">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="border-t border-border/50 bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold">看看能生成什么</h2>
              <p className="text-muted-foreground">以下为示例输出，实际效果更好</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-primary" />
                  <span className="font-medium">歌词方向</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>主题：</strong>春天、爱情、美好</p>
                  <p><strong>BPM：</strong>120</p>
                  <p><strong>Key：</strong>C Major</p>
                  <p><strong>结构：</strong>Intro → Verse1 → Pre-Chorus → Chorus → Verse2 → Bridge → Chorus → Outro</p>
                  <p><strong>Hook：</strong>春天的风，吹进我心里</p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Music2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Suno 提示词</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="rounded bg-muted p-2 font-mono text-xs">
                    [Verse]
                    Upbeat pop, synthesizers, dreamy vocals
                    Sunny spring day, romantic atmosphere
                    [Chorus]
                    Catchy melody, powerful drums
                    Emotional build, hopeful ending
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Image className="h-4 w-4 text-primary" />
                  <span className="font-medium">封面提示词</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="rounded bg-muted p-2 font-mono text-xs">
                    A girl in spring dress, pink cherry blossoms
                    behind her, soft natural lighting
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  <span className="font-medium">Shorts 脚本</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>0-3s：</strong>开场特效 + &quot;春天来了&quot;</p>
                  <p><strong>3-15s：</strong>主歌画面 + 歌词字幕</p>
                  <p><strong>15-30s：</strong>副歌 + 舞蹈</p>
                </div>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button size="xl" onClick={() => router.push("/register")}>
                <Play className="mr-2 h-4 w-4" />
                免费体验
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 VocalOS. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/pricing" className="hover:text-primary">定价</a>
              <a href="#" className="hover:text-primary">服务条款</a>
              <a href="#" className="hover:text-primary">隐私政策</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}