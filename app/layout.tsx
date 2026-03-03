import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Web3Provider } from "@/components/web3-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "XMUSIC - 音乐现金流资产化平台",
  description: "让每个歌手拥有自己的小投行，把音乐事业变成可投资项目",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased bg-[#121212] text-white`}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
