"use client";

import { Music, ChevronLeft, Shield, Cookie, Settings, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CookiePolicyPage() {
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
            <span className="font-bold">Cookie 政策</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-8">Cookie 政策</h1>
          
          <p className="text-[#B3B3B3] mb-6">
            最后更新日期：2025年2月1日
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-[#1DB954]" />
              什么是 Cookie？
            </h2>
            <p className="text-[#B3B3B3] mb-4">
              Cookie 是当您访问网站时存储在您设备上的小型文本文件。它们被广泛用于使网站正常运行或更高效地运行，以及向网站所有者提供信息。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#1DB954]" />
              我们如何使用 Cookie
            </h2>
            <p className="text-[#B3B3B3] mb-4">
              XMUSIC 使用 Cookie 来改善您的浏览体验，具体用途包括：
            </p>
            <ul className="list-disc list-inside text-[#B3B3B3] space-y-2 mb-4">
              <li><strong className="text-white">必要 Cookie：</strong> 使网站基本功能正常运行，如用户登录、安全验证等</li>
              <li><strong className="text-white">偏好 Cookie：</strong> 记住您的语言选择、货币偏好等设置</li>
              <li><strong className="text-white">分析 Cookie：</strong> 帮助我们了解用户如何使用网站，以便改进服务</li>
              <li><strong className="text-white">营销 Cookie：</strong> 用于向您展示相关的广告和营销内容</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#1DB954]" />
              第三方 Cookie
            </h2>
            <p className="text-[#B3B3B3] mb-4">
              我们可能会使用第三方服务提供商的 Cookie，包括：
            </p>
            <ul className="list-disc list-inside text-[#B3B3B3] space-y-2 mb-4">
              <li>Google Analytics - 用于网站流量分析</li>
              <li>Stripe - 用于支付处理</li>
              <li>社交媒体平台 - 用于社交分享功能</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#1DB954]" />
              管理您的 Cookie 偏好
            </h2>
            <p className="text-[#B3B3B3] mb-4">
              您可以通过以下方式管理 Cookie：
            </p>
            <ul className="list-disc list-inside text-[#B3B3B3] space-y-2 mb-4">
              <li>浏览器设置：大多数浏览器允许您拒绝或删除 Cookie</li>
              <li>我们的 Cookie 设置：您可以在网站底部找到 Cookie 设置选项</li>
              <li>第三方工具：使用行业标准的隐私保护工具</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-[#1DB954]" />
              删除 Cookie
            </h2>
            <p className="text-[#B3B3B3] mb-4">
              如果您想删除已存储的 Cookie，可以通过浏览器设置进行操作。请注意，删除 Cookie 可能会影响网站的某些功能。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">联系我们</h2>
            <p className="text-[#B3B3B3] mb-4">
              如果您对我们的 Cookie 政策有任何疑问，请通过以下方式联系我们：
            </p>
            <div className="bg-[#181818] rounded-lg p-4">
              <p className="text-[#B3B3B3]">邮箱：privacy@xmusic.com</p>
              <p className="text-[#B3B3B3]">地址：北京市朝阳区xxx大厦</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
