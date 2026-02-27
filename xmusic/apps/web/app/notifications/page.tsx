"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Music, 
  Bell, 
  Wallet, 
  TrendingUp, 
  MessageSquare, 
  Users,
  Check,
  Trash2,
  Settings,
  ArrowRight
} from "lucide-react";

// 模拟通知数据
const NOTIFICATIONS = {
  all: [
    {
      id: 1,
      type: "investment",
      title: "投资收益到账",
      message: "您在「林夕的2025巡演计划」中的投资已获得收益 $45",
      time: "10分钟前",
      read: false,
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/20",
    },
    {
      id: 2,
      type: "message",
      title: "新消息",
      message: "艺术家 林夕 回复了您的评论",
      time: "1小时前",
      read: false,
      icon: MessageSquare,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/20",
    },
    {
      id: 3,
      type: "project",
      title: "项目更新",
      message: "您关注的「新专辑《午夜飞行》」已完成 80% 众筹目标",
      time: "3小时前",
      read: true,
      icon: Wallet,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/20",
    },
    {
      id: 4,
      type: "system",
      title: "系统通知",
      message: "您的账户安全设置已更新",
      time: "昨天",
      read: true,
      icon: Bell,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/20",
    },
    {
      id: 5,
      type: "social",
      title: "新粉丝",
      message: "用户 MusicLover2025 关注了您",
      time: "2天前",
      read: true,
      icon: Users,
      iconColor: "text-pink-400",
      iconBg: "bg-pink-500/20",
    },
  ],
  unread: [
    {
      id: 1,
      type: "investment",
      title: "投资收益到账",
      message: "您在「林夕的2025巡演计划」中的投资已获得收益 $45",
      time: "10分钟前",
      read: false,
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/20",
    },
    {
      id: 2,
      type: "message",
      title: "新消息",
      message: "艺术家 林夕 回复了您的评论",
      time: "1小时前",
      read: false,
      icon: MessageSquare,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/20",
    },
  ],
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS.all);
  const [selectedTab, setSelectedTab] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const displayedNotifications = selectedTab === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const getNotificationLink = (type: string) => {
    switch (type) {
      case "investment":
        return "/dashboard";
      case "message":
        return "/chat";
      case "project":
        return "/explore";
      default:
        return "#";
    }
  };

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">通知中心</h1>
              <p className="text-zinc-400">
                您有 {unreadCount} 条未读通知
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-zinc-700"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                全部已读
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-zinc-700 text-red-400 hover:text-red-400"
                onClick={clearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-zinc-900 w-full justify-start mb-6">
            <TabsTrigger value="all" className="relative">
              全部
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-zinc-800">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              未读
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-emerald-500">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <NotificationList 
              notifications={displayedNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              getLink={getNotificationLink}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <NotificationList 
              notifications={displayedNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              getLink={getNotificationLink}
            />
          </TabsContent>
        </Tabs>

        {/* Settings Card */}
        <Card className="bg-zinc-900/50 border-zinc-800 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="font-semibold">通知设置</h3>
                  <p className="text-sm text-zinc-500">管理您的通知偏好</p>
                </div>
              </div>
              <Button variant="outline" className="border-zinc-700">
                设置
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 通知列表组件
interface NotificationListProps {
  notifications: typeof NOTIFICATIONS.all;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  getLink: (type: string) => string;
}

function NotificationList({ 
  notifications, 
  onMarkAsRead, 
  onDelete,
  getLink 
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-12 text-center">
          <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">暂无通知</p>
          <p className="text-sm text-zinc-600 mt-2">
            当有新的消息或更新时，您将在此处看到
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const Icon = notification.icon;
        return (
          <Card 
            key={notification.id} 
            className={`bg-zinc-900/50 border-zinc-800 transition-all hover:bg-zinc-800/50 ${
              !notification.read ? "border-l-4 border-l-emerald-500" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.iconBg}`}>
                  <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-semibold ${!notification.read ? "text-white" : "text-zinc-300"}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-zinc-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-emerald-400"
                          onClick={() => onMarkAsRead(notification.id)}
                          title="标记为已读"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-red-400"
                        onClick={() => onDelete(notification.id)}
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
