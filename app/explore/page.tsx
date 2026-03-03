"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  MapPin, 
  Music, 
  TrendingUp,
  Users,
  Play,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

// 模拟搜索数据
const ALL_ARTISTS = [
  {
    id: 1,
    name: "林夕",
    project: "2025巡演计划",
    genre: "独立流行",
    location: "北京",
    image: "🎵",
    coverGradient: "from-purple-600 to-blue-600",
    target: 50000,
    raised: 32500,
    investors: 128,
    monthlyListeners: "45.2K",
    verified: true,
  },
  {
    id: 2,
    name: "陈默",
    project: "新专辑《午夜飞行》",
    genre: "电子",
    location: "上海",
    image: "🎹",
    coverGradient: "from-emerald-600 to-teal-600",
    target: 30000,
    raised: 30000,
    investors: 89,
    monthlyListeners: "28.7K",
    verified: true,
  },
  {
    id: 3,
    name: "MC 阿龙",
    project: "地下说唱联盟",
    genre: "说唱",
    location: "成都",
    image: "🎤",
    coverGradient: "from-orange-600 to-red-600",
    target: 20000,
    raised: 8500,
    investors: 45,
    monthlyListeners: "12.3K",
    verified: false,
  },
  {
    id: 4,
    name: "小雨",
    project: "民谣诗集",
    genre: "民谣",
    location: "杭州",
    image: "🎸",
    coverGradient: "from-yellow-600 to-orange-600",
    target: 15000,
    raised: 12000,
    investors: 67,
    monthlyListeners: "18.5K",
    verified: false,
  },
  {
    id: 5,
    name: "DJ Nova",
    project: "电子音乐节",
    genre: "电子",
    location: "深圳",
    image: "🎧",
    coverGradient: "from-pink-600 to-purple-600",
    target: 40000,
    raised: 28000,
    investors: 95,
    monthlyListeners: "32.1K",
    verified: true,
  },
  {
    id: 6,
    name: "摇滚老张",
    project: "复出巡演",
    genre: "摇滚",
    location: "北京",
    image: "🎸",
    coverGradient: "from-red-600 to-pink-600",
    target: 60000,
    raised: 45000,
    investors: 156,
    monthlyListeners: "55.8K",
    verified: true,
  },
];

const GENRES = ["全部", "独立流行", "电子", "说唱", "民谣", "摇滚"];
const LOCATIONS = ["全部", "北京", "上海", "成都", "杭州", "深圳"];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("全部");
  const [selectedLocation, setSelectedLocation] = useState("全部");
  const [showFilters, setShowFilters] = useState(false);

  // 过滤逻辑
  const filteredArtists = ALL_ARTISTS.filter((artist) => {
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "全部" || artist.genre === selectedGenre;
    const matchesLocation = selectedLocation === "全部" || artist.location === selectedLocation;
    
    return matchesSearch && matchesGenre && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#070707] border-b border-[#282828] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B3B3B3]" />
            <Input
              type="text"
              placeholder="搜索音乐人、项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#242424] border-none rounded-full text-white placeholder:text-[#B3B3B3] focus:ring-2 focus:ring-[#1DB954]"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className={`text-white ${showFilters ? 'bg-[#282828]' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Filters */}
      {showFilters && (
        <div className="bg-[#181818] border-b border-[#282828] py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            {/* Genre Filter */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <span className="text-sm text-[#B3B3B3] whitespace-nowrap">风格:</span>
              {GENRES.map((genre) => (
                <Button
                  key={genre}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                  className={`whitespace-nowrap rounded-full px-4 ${
                    selectedGenre === genre
                      ? 'bg-[#1DB954] text-black hover:bg-[#1ED760]'
                      : 'text-white hover:bg-[#282828]'
                  }`}
                >
                  {genre}
                </Button>
              ))}
            </div>
            
            {/* Location Filter */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <span className="text-sm text-[#B3B3B3] whitespace-nowrap">地区:</span>
              {LOCATIONS.map((location) => (
                <Button
                  key={location}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(location)}
                  className={`whitespace-nowrap rounded-full px-4 ${
                    selectedLocation === location
                      ? 'bg-[#1DB954] text-black hover:bg-[#1ED760]'
                      : 'text-white hover:bg-[#282828]'
                  }`}
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {searchQuery ? `搜索结果: "${searchQuery}"` : "探索音乐人"}
          </h1>
          <span className="text-[#B3B3B3]">{filteredArtists.length} 个结果</span>
        </div>

        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <Link key={artist.id} href={`/artist/${artist.id}`}>
                <Card className="bg-[#181818] border-none hover:bg-[#282828] transition-all duration-300 group cursor-pointer p-4">
                  <CardContent className="p-0">
                    {/* Cover Image */}
                    <div className={`aspect-square rounded-md bg-gradient-to-br ${artist.coverGradient} mb-4 relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {artist.image}
                      </div>
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
                      </div>
                      <p className="text-sm text-[#B3B3B3] truncate">{artist.project}</p>
                      <div className="flex items-center gap-2 text-xs text-[#6a6a6a]">
                        <Music className="w-3 h-3" />
                        {artist.genre}
                        <span className="mx-1">·</span>
                        <MapPin className="w-3 h-3" />
                        {artist.location}
                      </div>

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
                        <div className="flex items-center gap-1 text-xs text-[#6a6a6a]">
                          <Users className="w-3 h-3" />
                          {artist.investors} 位投资人
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Music className="w-16 h-16 text-[#404040] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">未找到结果</h3>
            <p className="text-[#B3B3B3]">尝试其他关键词或调整筛选条件</p>
          </div>
        )}
      </main>
    </div>
  );
}
