"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Music2, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("请填写必填字段");
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Demo: 模拟注册
    setTimeout(() => {
      router.push("/workspace");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-muted/30 to-background p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute left-1/4 bottom-1/4 w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md border-primary/10 bg-white/80 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Music2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">创建账户</CardTitle>
          <CardDescription>开始你的 AI 音乐创作之旅</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">昵称 <span className="text-muted-foreground">(选填)</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="如何称呼你？"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">邮箱 <span className="text-destructive">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">密码 <span className="text-destructive">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="至少 8 位"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" loading={loading} size="lg">
              注册并开始
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              已有账号？{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                立即登录
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}