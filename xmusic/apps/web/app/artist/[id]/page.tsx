"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Music, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Play,
  Pause,
  Volume2,
  Users,
  Wallet,
  TrendingUp,
  MapPin,
  Verified,
  ChevronLeft,
  MoreHorizontal,
  Disc
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// 模拟音乐人数据 - 抖音风格
const ARTIST_DATA = {
  id: 1,
  name: "林夕",
  handle: "@linxi_music",
  avatar: "🎵",
  verified: true,
  bio: "独立音乐人 | 2025巡演筹备中 🎸",
  location: "北京",
  followers: "128.5K",
  following: "234",
  likes: "2.3M",
  monthlyListeners: "45.2K",
  project: {
    name: "2025全国巡演计划",
    target: 50000,
    raised: 32500,
    investors: 128,
    daysLeft: 15,
    return: "15% 年化",
  },
  tracks: [
    { id: 1, name: "午夜飞行", plays: "1.2M", duration: "3:45", liked: true },
    { id: 2, name: "城市边缘", plays: "856K", duration: "4:12", liked: false },
    { id: 3, name: "雨后的街", plays: "642K", duration: "3:28", liked: true },
    { id: 4, name: "远方", plays: "423K", duration: "3:56", liked: false },
  ],
  videos: [
    { id: 1, views: "2.3M", likes: "156K", thumbnail: "🎸" },
    { id: 2, views: "1.8M", likes: "98K", thumbnail: "🎹" },
    { id: 3, views: "956K", likes: "67K", thumbnail: "🎤" },
    { id: 4, views: "734K", likes: "45K", thumbnail: "🎵" },
    { id: 5, views: "523K", likes: "34K", thumbnail: "🎧" },
    { id: 6, views: "412K", likes: "28K", thumbnail: "🎼" },
  ],
};

export default function ArtistPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("videos");
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  const progress = (ARTIST_DATA.project.raised / ARTIST_DATA.project.target) * 100;

  return (
    <div className="min-h-screen bg-[#121212] pb-20">
      {/* Header */}
      <header className="bg-[#070707] border-b border-[#282828] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <span className="font-bold">{ARTIST_DATA.name}</span>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Profile Header - TikTok Style */}
      <div className="relative">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />

        {/* Profile Info */}
        <div className="px-4 -mt-12">
          <div className="flex items-end gap-4">
            <Avatar className="w-24 h-24 border-4 border-[#121212] bg-[#282828]">
              <AvatarFallback className="text-4xl">{ARTIST_DATA.avatar}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{ARTIST_DATA.name}</h1>
                {ARTIST_DATA.verified && (
                  <Verified className="w-5 h-5 text-[#1DB954]" />
                )}
              </div>
              <p className="text-[#B3B3B3]">{ARTIST_DATA.handle}</p>
            </div>
          </div>

          {/* Bio & Stats */}
          <div className="mt-4 space-y-3">
            <p className="text-white">{ARTIST_DATA.bio}</p>
            <div className="flex items-center gap-1 text-[#B3B3B3] text-sm">
              <MapPin className="w-4 h-4" />
              {ARTIST_DATA.location}
            </div>

            {/* Stats Row */}
            <div className="flex gap-6 py-2">
              <div className="text-center">
                <p className="font-bold text-lg">{ARTIST_DATA.following}</p>
                <p className="text-xs text-[#B3B3B3]">关注</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{ARTIST_DATA.followers}</p>
                <p className="text-xs text-[#B3B3B3]">粉丝</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{ARTIST_DATA.likes}</p>
                <p className="text-xs text-[#B3B3B3]">获赞</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold rounded-full"
              >
                投资支持
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-[#404040] text-white hover:bg-[#282828] rounded-full"
              >
                关注
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="border-[#404040] text-white hover:bg-[#282828] rounded-full"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Card */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-r from-[#1DB954]/20 to-[#1DB954]/5 border border-[#1DB954]/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-[#1DB954]" />
              <span className="font-bold">{ARTIST_DATA.project.name}</span>
            </div>
            <Badge className="bg-[#1DB954]/20 text-[#1DB954] border-none">
              融资中
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#B3B3B3]">已融资</span>
              <span className="font-bold">${ARTIST_DATA.project.raised.toLocaleString()} / ${ARTIST_DATA.project.target.toLocaleString()}</span>
            </div>            
            <Progress 
              value={progress} 
              className="h-2 bg-[#404040]"
            />

            <div className="flex justify-between text-xs text-[#B3B3B3]">
              <span>{ARTIST_DATA.project.investors} 位投资人</span>
              <span>{ARTIST_DATA.project.daysLeft} 天剩余</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#282828]">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-[#B3B3B3]">预期回报</p>
                <p className="font-bold text-[#1DB954]">{ARTIST_DATA.project.return}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#B3B3B3]">月听众</p>
                <p className="font-bold">{ARTIST_DATA.monthlyListeners}</p>
              </div>
            </div>
            <Button size="sm" className="bg-white text-black hover:bg-[#F0F0F0] rounded-full font-bold">
              立即投资
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-[#282828]">
        <div className="flex">
          {[
            { id: "videos", label: "作品", icon: Play },
            { id: "tracks", label: "音乐", icon: Music },
            { id: "investors", label: "投资人", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-white border-b-2 border-[#1DB954]"
                  : "text-[#B3B3B3] hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {activeTab === "videos" && (
          <div className="grid grid-cols-3 gap-1">
            {ARTIST_DATA.videos.map((video) => (
              <div 
                key={video.id} 
                className="aspect-[3/4] bg-[#282828] relative group cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {video.thumbnail}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-1 text-xs text-white">
                    <Play className="w-3 h-3" />
                    {video.views}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tracks" && (
          <div className="space-y-2">
            {ARTIST_DATA.tracks.map((track, index) => (
              <div 
                key={track.id} 
                className="flex items-center gap-3 p-3 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors group cursor-pointer"
              >
                <div className="w-8 text-center text-[#B3B3B3] text-sm">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="w-4 h-4 mx-auto hidden group-hover:block" />
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-br from-[#404040] to-[#282828] rounded flex items-center justify-center text-xl">
                  🎵
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-white">{track.name}</p>
                  <p className="text-xs text-[#B3B3B3]">{track.plays} 播放</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`${track.liked ? 'text-[#1DB954]' : 'text-[#B3B3B3]'} hover:text-[#1DB954]`}
                >
                  <Heart className={`w-5 h-5 ${track.liked ? 'fill-current' : ''}`} />
                </Button>
                
                <span className="text-xs text-[#B3B3B3]">{track.duration}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "investors" && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-[#404040] mx-auto mb-3" />
              <p className="text-[#B3B3B3]">{ARTIST_DATA.project.investors} 位投资人支持了这个项目</p>
              <Button className="mt-4 bg-[#1DB954] hover:bg-[#1ED760] text-black rounded-full">
                成为投资人
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
