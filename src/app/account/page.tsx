"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { 
  User, 
  CreditCard, 
  FolderOpen, 
  Download, 
  Settings,
  ChevronRight,
  Zap,
  Crown,
  Building2,
  Check
} from "lucide-react";

const mockProjects = [
  { id: "1", title: "春天流行歌", updatedAt: "2024-01-15", status: "archived" },
  { id: "2", title: "友情之歌", updatedAt: "2024-01-14", status: "active" },
  { id: "3", title: "电子舞曲", updatedAt: "2024-01-10", status: "archived" },
];

const mockExports = [
  { id: "1", projectTitle: "春天流行歌", type: "DOCX", createdAt: "2024-01-15" },
  { id: "2", projectTitle: "春天流行歌", type: "TXT", createdAt: "2024-01-15" },
  { id: "3", projectTitle: "友情之歌", type: "ZIP", createdAt: "2024-01-14" },
];

const plans = [
  { name: "免费版", icon: Zap, features: ["3 个项目", "1 次导出", "基础结果"] },
  { name: "Artist Pro", icon: Crown, features: ["50 个项目", "50 次导出", "全部结果", "优先队列"] },
  { name: "Studio", icon: Building2, features: ["无限制", "无限制", "全部功能", "API 访问"] },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "exports" | "subscription">("overview");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold">账户中心</h1>
          
          <div className="grid gap-6 md:grid-cols-4">
            {/* 侧边栏 */}
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === "overview" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent"
                }`}
              >
                <User className="h-5 w-5" />
                <span>概览</span>
              </button>
              
              <button
                onClick={() => setActiveTab("projects")}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === "projects" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent"
                }`}
              >
                <FolderOpen className="h-5 w-5" />
                <span>我的项目</span>
              </button>
              
              <button
                onClick={() => setActiveTab("exports")}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === "exports" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent"
                }`}
              >
                <Download className="h-5 w-5" />
                <span>导出记录</span>
              </button>
              
              <button
                onClick={() => setActiveTab("subscription")}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === "subscription" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span>订阅套餐</span>
              </button>
            </div>
            
            {/* 主内容区 */}
            <div className="md:col-span-3">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* 套餐信息 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>当前套餐</CardTitle>
                      <CardDescription>你的订阅状态</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-primary">免费版</div>
                          <p className="text-sm text-muted-foreground">
                            已使用 3 / 3 项目，1 / 1 导出
                          </p>
                        </div>
                        <Button>升级套餐</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* 快速统计 */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold">{mockProjects.length}</div>
                        <div className="text-sm text-muted-foreground">项目总数</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold">{mockExports.length}</div>
                        <div className="text-sm text-muted-foreground">导出记录</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* 最近项目 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>最近项目</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockProjects.slice(0, 3).map((project) => (
                          <div 
                            key={project.id}
                            className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                          >
                            <div>
                              <div className="font-medium">{project.title}</div>
                              <div className="text-xs text-muted-foreground">{project.updatedAt}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === "projects" && (
                <Card>
                  <CardHeader>
                    <CardTitle>我的项目</CardTitle>
                    <CardDescription>所有创作项目</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockProjects.map((project) => (
                        <div 
                          key={project.id}
                          className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{project.title}</div>
                            <div className="text-xs text-muted-foreground">
                              创建于 {project.updatedAt}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2 py-1 text-xs ${
                              project.status === "active" 
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {project.status === "active" ? "进行中" : "已归档"}
                            </span>
                            <Button size="sm" variant="ghost">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "exports" && (
                <Card>
                  <CardHeader>
                    <CardTitle>导出记录</CardTitle>
                    <CardDescription>你的导出历史</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockExports.map((exp) => (
                        <div 
                          key={exp.id}
                          className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                        >
                          <div>
                            <div className="font-medium">{exp.projectTitle}</div>
                            <div className="text-xs text-muted-foreground">
                              {exp.createdAt} · {exp.type}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            下载
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "subscription" && (
                <div className="space-y-6">
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>当前计划</CardTitle>
                      <CardDescription>免费版</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plans[0].features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="mt-4">升级到 Pro</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>可选套餐</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {plans.slice(1).map((plan, i) => (
                        <div 
                          key={i}
                          className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <plan.icon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{plan.name}</div>
                              <ul className="text-xs text-muted-foreground">
                                {plan.features.map((f, j) => (
                                  <li key={j}>· {f}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <Button variant="outline">选择</Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}