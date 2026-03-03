"use client";

import { Music, ChevronLeft, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const BLOG_POSTS = [
  {
    id: 1,
    title: "XMUSIC 平台正式上线：让音乐投资变得简单",
    excerpt: "我们很高兴宣布 XMUSIC 平台正式对外开放。现在，任何人都可以投资自己喜欢的独立音乐人，分享他们的成长收益...",
    author: "XMUSIC 团队",
    date: "2025-02-20",
    category: "平台动态",
    readTime: "5 分钟",
  },
  {
    id: 2,
    title: "如何评估一个音乐项目的投资价值？",
    excerpt: "投资音乐项目需要关注哪些指标？本文将从粉丝基础、历史表现、团队背景等多个维度为你解析...",
    author: "投资研究团队",
    date: "2025-02-18",
    category: "投资指南",
    readTime: "8 分钟",
  },
  {
    id: 3,
    title: "独立音乐人的融资新选择：Web3 时代的机遇",
    excerpt: "传统唱片公司的模式正在改变。Web3 技术让音乐人可以直接与粉丝和投资人建立联系，获得更灵活的资金支持...",
    author: "行业观察",
    date: "2025-02-15",
    category: "行业洞察",
    readTime: "6 分钟",
  },
  {
    id: 4,
    title: "林夕 2025 巡演项目融资成功案例分析",
    excerpt: "仅用 15 天，林夕的巡演项目就完成了 5 万美元融资目标。让我们看看这个项目成功的关键因素...",
    author: "案例研究",
    date: "2025-02-10",
    category: "成功案例",
    readTime: "10 分钟",
  },
  {
    id: 5,
    title: "加密货币支付指南：如何使用 USDC 投资音乐项目",
    excerpt: "对于初次接触加密货币的用户，本文将详细介绍如何设置钱包、购买 USDC，以及在 XMUSIC 平台上完成投资...",
    author: "产品团队",
    date: "2025-02-05",
    category: "使用教程",
    readTime: "12 分钟",
  },
  {
    id: 6,
    title: "音乐人如何设计有吸引力的融资方案？",
    excerpt: "一个好的融资方案需要明确的目标、合理的估值和清晰的收益分配。本文将为音乐人提供实用的方案设计建议...",
    author: "音乐人支持团队",
    date: "2025-02-01",
    category: "音乐人指南",
    readTime: "7 分钟",
  },
];

const CATEGORIES = ["全部", "平台动态", "投资指南", "行业洞察", "成功案例", "使用教程", "音乐人指南"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#070707] border-b border-[#282828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
              <Music className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold">XMUSIC 博客</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#1DB954]/20 to-[#121212] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">最新动态与洞察</h1>
          <p className="text-[#B3B3B3] text-lg max-w-2xl mx-auto">
            了解 XMUSIC 平台的最新更新、投资技巧和行业趋势
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-[#282828] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap rounded-full px-4 text-white hover:bg-[#282828] ${
                  category === "全部" ? "bg-[#282828]" : ""
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Card key={post.id} className="bg-[#181818] border-none hover:bg-[#282828] transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-[#1DB954]/20 text-[#1DB954] border-none">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-[#6a6a6a]">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3 group-hover:text-[#1DB954] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-[#B3B3B3] text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#282828]">
                    <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-4 text-[#1DB954] hover:text-[#1ED760] hover:bg-[#1DB954]/10">
                    阅读更多
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
