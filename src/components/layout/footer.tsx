import Link from "next/link";
import { Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Music2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">VocalOS</span>
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-primary transition-colors">
              定价
            </Link>
            <a href="#" className="hover:text-primary transition-colors">
              服务条款
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              隐私政策
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}