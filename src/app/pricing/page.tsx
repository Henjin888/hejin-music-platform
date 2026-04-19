"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Check, X, Zap, Crown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { plans as stripePlans, isStripeConfigured } from "@/lib/stripe";

// 本地套餐定义（备用）
const localPlans = [
  {
    name: "免费版",
    price: "¥0",
    period: "/月",
    description: "适合体验",
    icon: Zap,
    features: [
      { text: "3 个项目", included: true },
      { text: "1 次导出", included: true },
      { text: "基础结果", included: true },
      { text: "标准速度", included: true },
    ],
    notIncluded: ["优先队列", "专属客服"],
    cta: "免费开始",
    href: "/register",
  },
  {
    name: "Artist Pro",
    price: "¥49",
    period: "/月",
    description: "适合创作者",
    icon: Crown,
    popular: true,
    features: [
      { text: "50 个项目", included: true },
      { text: "50 次导出", included: true },
      { text: "全部结果", included: true },
      { text: "优先队列", included: true },
      { text: "专属客服", included: true },
    ],
    notIncluded: [],
    cta: "立即升级",
    href: "/register",
  },
  {
    name: "Studio",
    price: "¥199",
    period: "/月",
    description: "适合团队",
    icon: Building2,
    features: [
      { text: "无限制项目", included: true },
      { text: "无限制导出", included: true },
      { text: "全部结果", included: true },
      { text: "优先队列", included: true },
      { text: "专属客服", included: true },
      { text: "API 访问", included: true },
      { text: "白标定制", included: true },
    ],
    notIncluded: [],
    cta: "联系我们",
    href: "#",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const plans = isStripeConfigured ? stripePlans as any : localPlans;

  return (
    <div className="min-h-screen bg-[#0d1a14]">
      <Header />
      
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#00ff7f]/20 via-[#00ff7f]/10 to-transparent blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl text-[#e6f0e8]">
              选择你的计划
            </h1>
            <p className="text-lg text-[#809080]">
              从免费版开始，按需升级
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {(plans as any[]).map((plan: any, i: number) => (
              <Card
                key={i}
                className={cn(
                  "relative flex flex-col transition-all hover:shadow-xl border-[#233828] bg-[#141f19]",
                  (plan as any).popular
                    ? "border-[#00ff7f] shadow-lg shadow-[#00ff7f]/20 scale-105 z-10"
                    : "hover:border-[#00ff7f]/50"
                )}
              >
                {(plan as any).popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#00ff7f] px-3 py-1 text-xs font-medium text-[#003d1f]">
                      <Zap className="h-3 w-3" />
                      最受欢迎
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={cn(
                    "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
                    (plan as any).popular
                      ? "bg-[#00ff7f] shadow-lg shadow-[#00ff7f]/25"
                      : "bg-[#1a3323]"
                  )}>
                    {plan.popular ? (
                      <Crown className="h-6 w-6 text-[#003d1f]" />
                    ) : (
                      <Zap className="h-6 w-6 text-[#809080]" />
                    )}
                  </div>
                  <CardTitle className="text-xl text-[#e6f0e8]">{plan.name}</CardTitle>
                  <CardDescription className="text-[#809080]">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="mb-6 text-center">
                    <span className="text-4xl font-bold text-[#e6f0e8]">{(plan as any).price}</span>
                    <span className="text-sm text-[#809080]">{(plan as any).period}</span>
                  </div>
                  
                  <ul className="space-y-3">
                    {(plan as any).features?.map((feature: any, j: number) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[#e6f0e8]">
                        <Check className="h-4 w-4 text-[#00ff7f] flex-shrink-0" />
                        <span>{feature.text || feature}</span>
                      </li>
                    ))}
                    {(plan as any).notIncluded?.map((text: string, k: number) => (
                      <li key={k} className="flex items-center gap-2 text-sm text-[#809080]">
                        <X className="h-4 w-4 flex-shrink-0" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={(plan as any).popular ? "default" : "outline"}
                    onClick={() => router.push((plan as any).href)}
                  >
                    {(plan as any).cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-[#809080]">
              所有套餐可随时取消，企业套餐支持对公转账
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}