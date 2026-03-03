"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Music, X, CheckCircle, AlertCircle } from "lucide-react";

// IPFS 配置
const IPFS_CONFIG = {
  // 使用公共 IPFS 网关
  gateway: "https://ipfs.io/ipfs/",
  // 或使用 Infura IPFS
  // apiUrl: "https://ipfs.infura.io:5001",
  // 或使用 Pinata
  // pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  // pinataSecretKey: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
};

interface AudioUploadProps {
  onUploadComplete?: (cid: string, url: string) => void;
  onUploadError?: (error: Error) => void;
}

export default function AudioUpload({ onUploadComplete, onUploadError }: AudioUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCid, setUploadedCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 支持的音频格式
  const supportedFormats = [
    "audio/mpeg",      // MP3
    "audio/wav",       // WAV
    "audio/ogg",       // OGG
    "audio/aac",       // AAC
    "audio/flac",      // FLAC
    "audio/x-m4a",     // M4A
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setUploadedCid(null);

    if (!selectedFile) return;

    // 验证文件类型
    if (!supportedFormats.includes(selectedFile.type)) {
      setError("不支持的音频格式。请上传 MP3, WAV, OGG, AAC, FLAC 或 M4A 格式。");
      return;
    }

    // 验证文件大小
    if (selectedFile.size > maxFileSize) {
      setError("文件大小超过 50MB 限制。");
      return;
    }

    setFile(selectedFile);
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // 创建 FormData
      const formData = new FormData();
      formData.append("file", file);

      // 上传到 IPFS (使用 Pinata 或其他服务)
      // 这里使用模拟实现，实际部署时需要替换为真实的 IPFS 上传逻辑
      
      // 模拟上传延迟
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 生成模拟 CID
      const mockCid = "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const url = `${IPFS_CONFIG.gateway}${mockCid}`;

      clearInterval(progressInterval);
      setProgress(100);
      setUploadedCid(mockCid);

      onUploadComplete?.(mockCid, url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "上传失败";
      setError(errorMessage);
      onUploadError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
    setUploadedCid(null);
    setError(null);
  };

  // 获取音频时长（模拟）
  const getAudioDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = "metadata";
      
      audio.onloadedmetadata = () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      };

      audio.onerror = () => {
        resolve("未知时长");
      };

      audio.src = URL.createObjectURL(file);
    });
  };

  return (
    <Card className="bg-[#181818] border-none">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#1DB954]" />
          上传音频
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 文件选择区域 */}
        {!file ? (
          <div className="border-2 border-dashed border-[#282828] rounded-lg p-8 text-center hover:border-[#1DB954] transition-colors">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
              id="audio-upload"
            />
            <label htmlFor="audio-upload" className="cursor-pointer block">
              <Music className="w-12 h-12 text-[#404040] mx-auto mb-4" />
              <p className="text-white mb-2">点击或拖拽上传音频</p>
              <p className="text-sm text-[#6a6a6a]">支持 MP3, WAV, OGG, AAC, FLAC, M4A</p>
              <p className="text-xs text-[#6a6a6a] mt-1">最大 50MB</p>
            </label>
          </div>
        ) : (
          <div className="bg-[#282828] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Music className="w-8 h-8 text-[#1DB954]" />                <div>
                  <p className="text-white font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-[#6a6a6a]">                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={uploading}
                className="text-[#6a6a6a] hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* 上传进度 */}
            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2 bg-[#404040]" />
                <p className="text-xs text-[#B3B3B3] text-center">{progress}%</p>
              </div>
            )}

            {/* 上传成功 */}
            {uploadedCid && (
              <div className="flex items-center gap-2 text-[#1DB954] text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>上传成功！CID: {uploadedCid.slice(0, 10)}...{uploadedCid.slice(-6)}</span>
              </div>
            )}

            {/* 上传按钮 */}
            {!uploadedCid && !uploading && (
              <Button
                onClick={handleUpload}
                className="w-full bg-[#1DB954] hover:bg-[#1ED760] text-black"
              >
                开始上传
              </Button>
            )}
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* IPFS 说明 */}
        <div className="text-xs text-[#6a6a6a] space-y-1">
          <p>• 音频文件将存储在 IPFS 去中心化网络</p>
          <p>• 上传后获得唯一 CID，永久可访问</p>
          <p>• 建议同时备份到本地或其他存储</p>
        </div>
      </CardContent>
    </Card>
  );
}
