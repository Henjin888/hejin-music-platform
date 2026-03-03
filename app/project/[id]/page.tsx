"use client";

import { useParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Music, 
  ArrowLeft, 
  Users, 
  Wallet, 
  TrendingUp, 
  Clock, 
  FileText,
  PieChart,
  Activity,
  Share2,
  Heart
} from "lucide-react";
import Link from "next/link";

// 模拟项目数据
const PROJECTS = [
  {
    id: 1,
    name: "林夕的2025巡演计划",
    artist: "林夕",
    genre: "独立流行",
    target: 50000,
    raised: 32500,
    investors: 128,
    return: "15% 年化 + 治理权",
    stage: "融资中",
    image: "🎵",
    description: "支持我的首次全国巡演，包含10场演出。投资人将获得门票分成 + 周边收益。",
    allocation: {
      artist: 40,
      investors: 35,
      manager: 15,
      community: 10,
    },
    timeline: [
      { date: "2025-01", event: "项目启动" },
      { date: "2025-02", event: "融资完成" },
      { date: "2025-03", event: "巡演开始" },
      { date: "2025-06", event: "首次分红" },
    ],
  },
];

export default function ProjectPage() {
  const params = useParams();
  const project = PROJECTS[0];
  const progress = (project.raised / project.target) * 100;

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#070707] border-b border-[#282828] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <span className="font-bold">{project.name}</span>
          </div>
          <ConnectButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600">
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                {project.image}
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-[#1DB954] text-black border-none">
                  {project.stage}
                </Badge>
              </div>
            </div>

            {/* Project Info */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <div className="flex items-center gap-4 text-[#B3B3B3]">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback>{project.artist[0]}</AvatarFallback>
                    </Avatar>
                    <span>{project.artist}</span>
                  </div>
                  <span>·</span>
                  <span>{project.genre}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="border-[#404040]">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-[#404040]">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-[#B3B3B3] leading-relaxed">{project.description}</p>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-[#181818] border-b border-[#282828] w-full justify-start rounded-none h-auto p-0">
                {[
                  { value: "overview", label: "概览", icon: FileText },
                  { value: "allocation", label: "份额分配", icon: PieChart },
                  { value: "timeline", label: "时间线", icon: Clock },
                  { value: "activity", label: "动态", icon: Activity },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#1DB954] data-[state=active]:bg-transparent rounded-none px-6 py-3"
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="bg-[#181818] border-[#282828]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#1DB954]" />
                      项目详情
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#282828] rounded-lg">
                        <p className="text-sm text-[#B3B3B3] mb-1">融资目标</p>
                        <p className="text-2xl font-bold">${project.target.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-[#282828] rounded-lg">
                        <p className="text-sm text-[#B3B3B3] mb-1">已融资</p>
                        <p className="text-2xl font-bold text-[#1DB954]">${project.raised.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="allocation" className="mt-6">
                <Card className="bg-[#181818] border-[#282828]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-[#1DB954]" />
                      份额分配
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "艺人", value: project.allocation.artist, color: "bg-purple-500" },
                        { label: "投资人", value: project.allocation.investors, color: "bg-[#1DB954]" },
                        { label: "经纪人", value: project.allocation.manager, color: "bg-blue-500" },
                        { label: "社区储备", value: project.allocation.community, color: "bg-yellow-500" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-4">
                          <div className={`w-4 h-4 rounded ${item.color}`} />
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span>{item.label}</span>
                              <span className="font-bold">{item.value}%</span>
                            </div>
                            <Progress value={item.value} className="h-2 bg-[#404040]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <Card className="bg-[#181818] border-[#282828]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#1DB954]" />
                      项目时间线
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.timeline.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-[#1DB954]" />
                            {index < project.timeline.length - 1 && (
                              <div className="w-0.5 h-12 bg-[#404040]" />
                            )}
                          </div>
                          <div className="pb-6">
                            <p className="text-sm text-[#B3B3B3]">{item.date}</p>
                            <p className="font-medium">{item.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <Card className="bg-[#181818] border-[#282828] sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-[#B3B3B3] mb-2">融资进度</p>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-bold">{progress.toFixed(0)}%</span>
                    <span className="text-sm text-[#B3B3B3]">{project.investors} 位投资人</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-[#404040]" />
                </div>

                <Separator className="bg-[#282828]" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#B3B3B3]">预期回报</span>
                    <span className="font-bold text-[#1DB954]">{project.return}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B3B3B3]">最低投资</span>
                    <span className="font-bold">$10</span>
                  </div>
                </div>

                <Button className="w-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold rounded-full py-6">
                  <Wallet className="w-5 h-5 mr-2" />
                  立即投资
                </Button>

                <p className="text-xs text-center text-[#6a6a6a]">
                  连接钱包后即可投资
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
