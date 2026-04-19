"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/pricing", label: "定价" },
];

const authItems = [
  { href: "/login", label: "登录" },
  { href: "/register", label: "注册" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/25">
            <Music2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            VocalOS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {pathname !== "/login" && pathname !== "/register" && (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">开始创作</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}