"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Music, 
  ArrowLeft,
  Upload,
  Users,
  Wallet,
  PieChart,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const STEPS = [
  { id: 1, title: "基本信息", description: "项目介绍和艺人资料" },
  { id: 2, title: "融资设置", description: "目标和份额分配" },
  { id: 3, title: "团队配置", description: "添加经纪人等角色" },
  { id: 4, title: "确认发布", description: "审核并上线" },
];

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">发起新项目</h1>
          <p className="text-zinc-400">创建你的音乐事业融资计划，让投资人和粉丝一起参与</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    currentStep >= step.id
                      ? "bg-emerald-500 text-black"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-zinc-500">{step.description}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-px mx-2 sm:mx-4 ${
                    currentStep > step.id ? "bg-emerald-500" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>项目封面</Label>
                  <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-zinc-600 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">点击上传或拖拽图片到此处</p>
                    <p className="text-xs text-zinc-600 mt-1">支持 JPG、PNG，建议尺寸 1200x600</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">项目名称 *</Label>
                  <Input
                    id="name"
                    placeholder="例如：2025全国巡演计划"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">项目介绍 *</Label>
                  <Textarea
                    id="description"
                    placeholder="介绍你的音乐项目、计划和愿景..."
                    className="bg-zinc-800 border-zinc-700 min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="genre">音乐风格 *</Label>
                    <Input
                      id="genre"
                      placeholder="例如：独立流行"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">项目地点 *</Label>
                    <Input
                      id="location"
                      placeholder="例如：全国巡演"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">融资目标 (USDC) *</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="50000"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">融资周期 (天) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minInvest">最低投资 (USDC) *</Label>
                    <Input
                      id="minInvest"
                      type="number"
                      placeholder="10"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerShare">每份价格 (USDC) *</Label>
                    <Input
                      id="pricePerShare"
                      type="number"
                      placeholder="0.5"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div>
                  <Label className="flex items-center gap-2 mb-4">
                    <PieChart className="w-4 h-4" />
                    收益分配结构
                  </Label>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="artistShare">歌手份额 (%)</Label>
                        <Input
                          id="artistShare"
                          type="number"
                          defaultValue={40}
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="investorShare">投资人份额 (%)</Label>
                        <Input
                          id="investorShare"
                          type="number"
                          defaultValue={35}
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agentShare">经纪人份额 (%)</Label>
                        <Input
                          id="agentShare"
                          type="number"
                          defaultValue={15}
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="communityShare">社区份额 (%)</Label>
                        <Input
                          id="communityShare"
                          type="number"
                          defaultValue={10}
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-400 font-medium">提示</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      份额分配总和必须等于 100%。建议给投资人较高比例以吸引更多资金。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    项目团队
                  </Label>
                  <p className="text-sm text-zinc-500">
                    添加经纪人、制作人等项目核心成员
                  </p>
                </div>

                <div className="space-y-4">
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">歌手（你）</p>
                          <p className="text-sm text-zinc-500">项目创始人</p>
                        </div>
                        <Badge>40%</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">经纪人</p>
                        <Badge>15%</Badge>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">钱包地址</Label>
                        <Input
                          placeholder="0x..."
                          className="bg-zinc-900 border-zinc-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">姓名/艺名</Label>
                        <Input
                          placeholder="例如：张经理"
                          className="bg-zinc-900 border-zinc-600"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Button variant="outline" className="w-full border-zinc-700 border-dashed">
                    + 添加团队成员
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-emerald-400 font-medium">准备就绪</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      请确认以下信息无误，发布后将在链上创建项目合约。
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-500">项目名称</span>
                    <span>2025全国巡演计划</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-500">融资目标</span>
                    <span>50,000 USDC</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-500">融资周期</span>
                    <span>30 天</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-500">每份价格</span>
                    <span>0.5 USDC</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-zinc-500">平台手续费</span>
                    <span>2.5%</span>
                  </div>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <p className="text-sm text-zinc-400 mb-2">预计获得</p>
                  <p className="text-2xl font-bold text-emerald-400">48,750 USDC</p>
                  <p className="text-xs text-zinc-500 mt-1">扣除 2.5% 平台手续费后</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="border-zinc-700"
              >
                上一步
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  下一步
                </Button>
              ) : (
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Wallet className="w-4 h-4 mr-2" />
                  确认并发布
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
