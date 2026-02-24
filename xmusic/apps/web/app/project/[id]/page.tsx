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
      agent: 15,
      community: 10,
    },
    details: {
      location: "全国10城巡演",
      duration: "2025年3月-6月",
      minInvest: 10,
      totalShares: 100000,
      pricePerShare: 0.5,
    },
    team: [
      { role: "创始人", name: "林夕", share: "40%" },
      { role: "经纪人", name: "张经理", share: "15%" },
    ],
    updates: [
      { date: "2025-02-20", title: "项目上线", content: "融资正式开始，目标5万美元" },
      { date: "2025-02-18", title: "预热启动", content: "社交媒体预热，已有200+粉丝关注" },
    ],
  },
  {
    id: 2,
    name: "新专辑《午夜飞行》",
    artist: "陈默",
    genre: "电子",
    target: 30000,
    raised: 30000,
    investors: 89,
    return: "12% 年化 + 优先购买权",
    stage: "已达成",
    image: "🎹",
    description: "制作第三张录音室专辑，包含8首原创曲目。",
    allocation: {
      artist: 45,
      investors: 30,
      agent: 15,
      community: 10,
    },
    details: {
      location: "北京录音棚",
      duration: "2025年全年",
      minInvest: 20,
      totalShares: 60000,
      pricePerShare: 0.5,
    },
    team: [
      { role: "创始人", name: "陈默", share: "45%" },
      { role: "制作人", name: "李制作", share: "10%" },
      { role: "经纪人", name: "王经纪", share: "15%" },
    ],
    updates: [
      { date: "2025-02-15", title: "融资完成", content: "3万美元目标达成，共89位投资人参与" },
      { date: "2025-02-10", title: "录音启动", content: "第一首单曲开始录制" },
    ],
  },
  {
    id: 3,
    name: "地下说唱联盟",
    artist: "MC 阿龙",
    genre: "说唱",
    target: 20000,
    raised: 8500,
    investors: 45,
    return: "20% 年化 + 演出优先权",
    stage: "融资中",
    image: "🎤",
    description: "组建本地说唱厂牌，培养新人，举办月度Battle赛事。",
    allocation: {
      artist: 35,
      investors: 40,
      agent: 15,
      community: 10,
    },
    details: {
      location: "成都",
      duration: "长期运营",
      minInvest: 5,
      totalShares: 40000,
      pricePerShare: 0.5,
    },
    team: [
      { role: "创始人", name: "MC 阿龙", share: "35%" },
      { role: "合伙人", name: "DJ 小虎", share: "10%" },
      { role: "经纪人", name: "刘经纪", share: "15%" },
    ],
    updates: [
      { date: "2025-02-22", title: "首场Battle", content: "本月30日举办首场线下Battle赛事" },
      { date: "2025-02-15", title: "项目启动", content: "厂牌正式成立，开始招募成员" },
    ],
  },
];

export default function ProjectPage() {
  const params = useParams();
  const projectId = Number(params.id);
  const project = PROJECTS.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">项目未找到</h1>
          <Link href="/">
            <Button variant="outline">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = (project.raised / project.target) * 100;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Music className="w-6 h-6 text-emerald-400" />
              <span className="font-bold">XMUSIC</span>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-sm text-zinc-500 hover:text-white">
              项目市场
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-sm text-zinc-400">{project.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24 bg-zinc-800">
              <AvatarFallback className="text-4xl">{project.image}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-zinc-800">
                  {project.genre}
                </Badge>
                <Badge
                  className={
                    project.stage === "已达成"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }
                >
                  {project.stage}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-zinc-400">{project.artist}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-zinc-900 w-full justify-start">
                <TabsTrigger value="overview">项目概览</TabsTrigger>
                <TabsTrigger value="allocation">份额分配</TabsTrigger>
                <TabsTrigger value="team">团队</TabsTrigger>
                <TabsTrigger value="updates">动态</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle>项目介绍</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-zinc-300">{project.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500">项目周期</p>
                          <p className="font-medium">{project.details.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500">项目地点</p>
                          <p className="font-medium">{project.details.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500">最低投资</p>
                          <p className="font-medium">${project.details.minInvest} USDC</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500">总份额</p>
                          <p className="font-medium">{project.details.totalShares.toLocaleString()} 份</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="allocation" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      收益分配结构
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-zinc-400">歌手（创始人）</span>
                          <span className="font-medium">{project.allocation.artist}%</span>
                        </div>
                        <Progress value={project.allocation.artist} className="h-2 bg-zinc-800" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-zinc-400">投资人</span>
                          <span className="font-medium">{project.allocation.investors}%</span>
                        </div>
                        <Progress value={project.allocation.investors} className="h-2 bg-zinc-800" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-zinc-400">经纪人/运营</span>
                          <span className="font-medium">{project.allocation.agent}%</span>
                        </div>
                        <Progress value={project.allocation.agent} className="h-2 bg-zinc-800" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-zinc-400">社区储备</span>
                          <span className="font-medium">{project.allocation.community}%</span>
                        </div>
                        <Progress value={project.allocation.community} className="h-2 bg-zinc-800" />
                      </div>
                    </div>

                    <Separator className="bg-zinc-800" />

                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <p className="text-sm text-zinc-400 mb-2">每份价格</p>
                      <p className="text-2xl font-bold">${project.details.pricePerShare} USDC</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle>项目团队</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.team.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-zinc-700">
                                {member.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-zinc-500">{member.role}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">{member.share}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle>项目动态</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.updates.map((update, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            {index !== project.updates.length - 1 && (
                              <div className="w-px h-full bg-zinc-800 mt-2" />
                            )}
                          </div>
                          <div className="pb-6">
                            <p className="text-sm text-zinc-500 mb-1">{update.date}</p>
                            <p className="font-medium mb-1">{update.title}</p>
                            <p className="text-sm text-zinc-400">{update.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Investment Card */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/50 border-zinc-800 sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">投资该项目</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">融资进度</span>
                    <span className="font-medium">
                      ${project.raised.toLocaleString()} / ${project.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 bg-zinc-800" />
                  <p className="text-sm text-zinc-500 text-right">
                    {progress.toFixed(1)}%
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-zinc-500 text-sm mb-1">
                      <Users className="w-4 h-4" />
                      投资人
                    </div>
                    <p className="text-xl font-bold">{project.investors}</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-zinc-500 text-sm mb-1">
                      <TrendingUp className="w-4 h-4" />
                      预期回报
                    </div>
                    <p className="text-xl font-bold text-emerald-400">{project.return.split(" ")[0]}</p>
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="space-y-3">
                  <p className="text-sm text-zinc-400">投资金额 (USDC)</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="border-zinc-700">
                      $10
                    </Button>
                    <Button variant="outline" size="sm" className="border-zinc-700">
                      $50
                    </Button>
                    <Button variant="outline" size="sm" className="border-zinc-700">
                      $100
                    </Button>
                  </div>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                    连接钱包投资
                  </Button>
                </div>

                <p className="text-xs text-zinc-500 text-center">
                  投资有风险，请仔细阅读项目白皮书
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
