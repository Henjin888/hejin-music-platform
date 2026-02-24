"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Music, 
  TrendingUp, 
  Users, 
  Wallet, 
  ArrowRight, 
  Disc, 
  Play,
  Heart,
  Share2,
  MapPin,
  Verified
} from "lucide-react";
import Link from "next/link";

// 模拟项目数据 - Spotify 风格
const FEATURED_ARTISTS = [
  {
    id: 1,
    name: "林夕",
    project: "2025巡演计划",
    genre: "独立流行",
    image: "🎵",
    coverGradient: "from-purple-600 to-blue-600",
    target: 50000,
    raised: 32500,
    investors: 128,
    monthlyListeners: "45.2K",
    topTrack: "午夜飞行",
    verified: true,
  },
  {
    id: 2,
    name: "陈默",
    project: "新专辑《午夜飞行》",
    genre: "电子",
    image: "🎹",
    coverGradient: "from-emerald-600 to-teal-600",
    target: 30000,
    raised: 30000,
    investors: 89,
    monthlyListeners: "28.7K",
    topTrack: "深海",
    verified: true,
  },
  {
    id: 3,
    name: "MC 阿龙",
    project: "地下说唱联盟",
    genre: "说唱",
    image: "🎤",
    coverGradient: "from-orange-600 to-red-600",
    target: 20000,
    raised: 8500,
    investors: 45,
    monthlyListeners: "12.3K",
    topTrack: "街头故事",
    verified: false,
  },
];

const STATS = [
  { label: "已上线艺人", value: "12", icon: Disc },
  { label: "累计融资", value: "$180K+", icon: Wallet },
  { label: "活跃投资人", value: "456", icon: Users },
  { label: "平均回报", value: "14.5%", icon: TrendingUp },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header - Spotify Style */}
      <header className="bg-[#070707] border-b border-[#282828] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">XMUSIC</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-[#B3B3B3] hover:text-white transition-colors font-medium">
              发现
            </a>
            <a href="#" className="text-sm text-[#B3B3B3] hover:text-white transition-colors font-medium">
              浏览
            </a>
            <a href="#" className="text-sm text-[#B3B3B3] hover:text-white transition-colors font-medium">
              投资人
            </a>
            <a href="#" className="text-sm text-[#B3B3B3] hover:text-white transition-colors font-medium">
              治理
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-[#B3B3B3] hover:text-white hidden sm:flex"
              >
                注册
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                className="bg-white text-black hover:bg-[#F0F0F0] rounded-full px-6 font-bold"
              >
                登录
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - Spotify Green Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1DB954]/30 via-[#121212] to-[#121212]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/30 hover:bg-[#1DB954]/30">
              Web3 音乐投资基础设施
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              让每个歌手拥有
              <br />
              <span className="text-[#1DB954]">
                自己的小投行
              </span>
            </h1>
            <p className="text-lg text-[#B3B3B3] mb-8 max-w-xl leading-relaxed">
              XMUSIC 是音乐现金流的资产化和分配层。把音乐事业变成可投资、可分配、可治理的数字资产。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/explore">
                <Button 
                  size="lg" 
                  className="bg-[#1DB954] hover:bg-[#1ED760] text-black rounded-full px-8 font-bold text-base"
                >
                  <Play className="mr-2 w-5 h-5" />
                  开始探索
                </Button>
              </Link>
              <Link href="/create">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-[#878787] text-white hover:bg-white/10 rounded-full px-8 font-bold"
                >
                  发起融资
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Spotify Style Cards */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <Card key={stat.label} className="bg-[#181818] border-none hover:bg-[#282828] transition-colors">
                <CardContent className="p-6">
                  <stat.icon className="w-6 h-6 text-[#1DB954] mb-3" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-[#B3B3B3]">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists - Spotify Grid Style */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">热门音乐人</h2>
            <Link href="/explore">
              <Button variant="ghost" className="text-[#B3B3B3] hover:text-white text-sm font-bold">
                查看全部
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {FEATURED_ARTISTS.map((artist) => (
              <Link key={artist.id} href={`/artist/${artist.id}`}>
                <Card className="bg-[#181818] border-none hover:bg-[#282828] transition-all duration-300 group cursor-pointer p-4">
                  <CardContent className="p-0">
                    {/* Cover Image */}
                    <div className={`aspect-square rounded-md bg-gradient-to-br ${artist.coverGradient} mb-4 relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {artist.image}
                      </div>
                      {/* Play Button Overlay */}
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                        <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 text-black ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Artist Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white truncate">{artist.name}</h3>
                        {artist.verified && (
                          <Verified className="w-4 h-4 text-[#1DB954]" />
                        )}
                      </div>
                      <p className="text-sm text-[#B3B3B3] truncate">{artist.project}</p>
                      <p className="text-xs text-[#6a6a6a]">{artist.monthlyListeners} 月听众</p>

                      {/* Funding Progress */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#1DB954] font-medium">${(artist.raised / 1000).toFixed(1)}K</span>
                          <span className="text-[#6a6a6a]">${(artist.target / 1000).toFixed(0)}K</span>
                        </div>
                        <Progress 
                          value={(artist.raised / artist.target) * 100} 
                          className="h-1 bg-[#404040]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Spotify Style */}
      <section className="py-16 bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">如何运作</h2>
            <p className="text-[#B3B3B3] max-w-2xl mx-auto">
              每个歌手项目都是一个独立的小公司，拥有清晰的权利结构和收益分配机制
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#181818] border-none p-6">
              <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center mb-4">
                <Disc className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">发现音乐人</h3>
              <p className="text-[#B3B3B3] text-sm leading-relaxed">
                浏览不同风格的独立音乐人，了解他们的项目计划、历史表现和收益预期。
              </p>
            </Card>

            <Card className="bg-[#181818] border-none p-6">
              <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">投资份额</h3>
              <p className="text-[#B3B3B3] text-sm leading-relaxed">
                使用 USDC 购买项目份额代币，最低 $10 起投，成为音乐事业的股东。
              </p>
            </Card>

            <Card className="bg-[#181818] border-none p-6">
              <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">分享收益</h3>
              <p className="text-[#B3B3B3] text-sm leading-relaxed">
                项目产生的收益自动按比例分配，随时提取你的投资回报。
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">准备好开始了吗？</h2>
          <p className="text-[#B3B3B3] mb-8 max-w-2xl mx-auto text-lg">
            无论你是歌手、投资人还是经纪人，XMUSIC 都能帮你开启音乐事业的新篇章。
          </p>
          <Link href="/login">
            <Button 
              size="lg" 
              className="bg-[#1DB954] hover:bg-[#1ED760] text-black rounded-full px-10 font-bold text-lg"
            >
              免费注册
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Spotify Style */}
      <footer className="bg-[#070707] border-t border-[#282828] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
                <Music className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold">XMUSIC</span>
            </div>
            <div className="flex gap-6 text-sm text-[#B3B3B3]">
              <Link href="/about" className="hover:text-white transition-colors">关于我们</Link>
              <Link href="/blog" className="hover:text-white transition-colors">博客</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
              <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie 政策</Link>
            </div>
            <p className="text-sm text-[#6a6a6a]">
              © 2025 XMUSIC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
