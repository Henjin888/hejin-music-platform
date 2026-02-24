"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Music, 
  Wallet, 
  TrendingUp, 
  PieChart,
  History,
  Settings,
  LogOut,
  Disc,
  DollarSign,
  Users
} from "lucide-react";

// 模拟用户数据
const USER_DATA = {
  address: "0x1234...5678",
  totalInvested: 12500,
  totalReturns: 850,
  activeProjects: 3,
  pendingRewards: 120,
};

const INVESTMENTS = [
  {
    id: 1,
    projectName: "林夕的2025巡演计划",
    invested: 5000,
    shares: 10000,
    returns: 350,
    status: "active",
    progress: 65,
  },
  {
    id: 2,
    projectName: "新专辑《午夜飞行》",
    invested: 3000,
    shares: 6000,
    returns: 280,
    status: "completed",
    progress: 100,
  },
  {
    id: 3,
    projectName: "地下说唱联盟",
    invested: 4500,
    shares: 9000,
    returns: 220,
    status: "active",
    progress: 42,
  },
];

const TRANSACTIONS = [
  { date: "2025-02-20", type: "invest", project: "林夕的2025巡演计划", amount: 2000 },
  { date: "2025-02-15", type: "claim", project: "新专辑《午夜飞行》", amount: 150 },
  { date: "2025-02-10", type: "invest", project: "地下说唱联盟", amount: 1500 },
  { date: "2025-02-05", type: "claim", project: "新专辑《午夜飞行》", amount: 130 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-emerald-400" />
            <span className="font-bold">XMUSIC</span>
          </div>
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">投资面板</h1>
          <p className="text-zinc-400">管理你的音乐投资组合</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">总投资额</p>
                  <p className="text-xl font-bold">${USER_DATA.totalInvested.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">累计收益</p>
                  <p className="text-xl font-bold text-cyan-400">+${USER_DATA.totalReturns}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Disc className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">活跃项目</p>
                  <p className="text-xl font-bold">{USER_DATA.activeProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">待领取</p>
                  <p className="text-xl font-bold text-amber-400">${USER_DATA.pendingRewards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="investments">
              <TabsList className="bg-zinc-900 w-full justify-start">
                <TabsTrigger value="investments">我的投资</TabsTrigger>
                <TabsTrigger value="transactions">交易记录</TabsTrigger>
                <TabsTrigger value="governance">治理投票</TabsTrigger>
              </TabsList>

              <TabsContent value="investments" className="mt-6">
                <div className="space-y-4">
                  {INVESTMENTS.map((inv) => (
                    <Card key={inv.id} className="bg-zinc-900/50 border-zinc-800">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold mb-1">{inv.projectName}</h3>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className={inv.status === "active" 
                                  ? "bg-emerald-500/20 text-emerald-400" 
                                  : "bg-blue-500/20 text-blue-400"
                                }
                              >
                                {inv.status === "active" ? "进行中" : "已完成"}
                              </Badge>
                              <span className="text-sm text-zinc-500">{inv.shares.toLocaleString()} 份额</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-zinc-500">已投资</p>
                            <p className="font-bold">${inv.invested.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">项目进度</span>
                            <span className="font-medium">{inv.progress}%</span>
                          </div>
                          <Progress value={inv.progress} className="h-2 bg-zinc-800" />
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                          <div>
                            <p className="text-sm text-zinc-500">累计收益</p>
                            <p className="text-emerald-400 font-medium">+${inv.returns}</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-zinc-700">
                            查看详情
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      交易记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {TRANSACTIONS.map((tx, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === "invest" 
                                ? "bg-emerald-500/20" 
                                : "bg-cyan-500/20"
                            }`}>
                              {tx.type === "invest" ? (
                                <Wallet className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <DollarSign className="w-5 h-5 text-cyan-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {tx.type === "invest" ? "投资" : "领取收益"}
                              </p>
                              <p className="text-sm text-zinc-500">{tx.project}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              tx.type === "invest" ? "text-white" : "text-cyan-400"
                            }`}>
                              {tx.type === "invest" ? "-" : "+"}${tx.amount}
                            </p>
                            <p className="text-sm text-zinc-500">{tx.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="governance" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-500">暂无活跃提案</p>
                    <p className="text-sm text-zinc-600 mt-2">
                      当项目发起治理投票时，你将在此看到
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/50 border-zinc-800 sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                  <Wallet className="w-4 h-4 mr-2" />
                  领取收益 (${USER_DATA.pendingRewards})
                </Button>

                <Separator className="bg-zinc-800" />

                <Button variant="outline" className="w-full border-zinc-700">
                  <PieChart className="w-4 h-4 mr-2" />
                  投资组合分析
                </Button>

                <Button variant="outline" className="w-full border-zinc-700">
                  <Settings className="w-4 h-4 mr-2" />
                  设置
                </Button>

                <Button variant="outline" className="w-full border-zinc-700 text-red-400 hover:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  断开连接
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
