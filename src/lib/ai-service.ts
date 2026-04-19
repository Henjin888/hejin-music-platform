// VocalOS AI 生成服务 - 补充 Suno / 图片生成

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// ============ Suno 音乐生成 ============
interface SunoConfig {
  prompt: string;
  title?: string;
  tags?: string;  // genre, mood
  custom?: boolean;  // 是否原创
}

interface SunoResult {
  id: string;
  audioUrl: string;
  videoUrl?: string;
  imageUrl?: string;
  status: "complete" | "error";
}

// 注意：Suno 没有官方公开 API
// 方案 1：使用第三方 API（推荐）
// 方案 2：使用 Suno 的 iframe 嵌入播放
// 方案 3：通过浏览器自动化调用

export async function generateMusicWithSuno(prompt: string): Promise<SunoResult | null> {
  // TODO: 实现方式1 - 第三方 Suno API
  // 方案：使用 https://api.suno.ai 或类似第三方服务
  
  // 方案 B：通过 Webhook 回调方式
  // 用户点击生成后，后台调度 Suno，返回任务 ID，然后轮询状态
  
  // 方案 C：返回提示词给用户，让用户自己在 Suno 生成
  return null;
}

// 获取 Suno 生成的歌曲状态
export async function getSunoStatus(taskId: string): Promise<SunoResult | null> {
  // TODO: 轮询 Suno 任务状态
  return null;
}

// ============ 图片生成 ============
export async function generateCoverImage(prompt: string): Promise<string | null> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });
    
    if (response.data && response.data.length > 0) {
      return response.data[0].url || null;
    }
    return null;
  } catch (error) {
    console.error("图片生成失败:", error);
    return null;
  }
}

// 生成竖版封面（9:16）
export async function generateCoverImageVertical(prompt: string): Promise<string | null> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt + ", vertical aspect ratio 9:16, suitable for social media cover",
      n: 1,
      size: "1024x1792",
      quality: "standard",
      style: "vivid",
    });
    
    if (response.data && response.data.length > 0) {
      return response.data[0].url || null;
    }
    return null;
  } catch (error) {
    console.error("竖版图片生成失败:", error);
    return null;
  }
}

// ============ 文件导出 ============
interface ExportData {
  summary?: object;
  lyrics?: string;
  sunoPrompt?: string;
  coverPrompt?: string;
  shortsScript?: string;
  releaseCopy?: string;
}

export function generateTxtExport(data: ExportData): string {
  const lines = [
    "=== VocalOS 音乐创作导出 ===",
    "",
    "【摘要】",
    data.summary ? JSON.stringify(data.summary, null, 2) : "",
    "",
    "【歌词方向】",
    data.lyrics || "",
    "",
    "【Suno 提示词】",
    data.sunoPrompt || "",
    "",
    "【封面提示词】",
    data.coverPrompt || "",
    "",
    "【Shorts 脚本】",
    data.shortsScript || "",
    "",
    "【发布文案】",
    data.releaseCopy || "",
  ];
  
  return lines.join("\n");
}

export function generateMdExport(data: ExportData): string {
  const lines = [
    "# VocalOS 音乐创作导出",
    "",
    "## 摘要",
    data.summary ? JSON.stringify(data.summary, null, 2) : "- 无",
    "",
    "## 歌词方向",
    data.lyrics || "- 无",
    "",
    "## Suno 提示词",
    "```",
    data.sunoPrompt || "- 无",
    "```",
    "",
    "## 封面提示词",
    data.coverPrompt || "- 无",
    "",
    "## Shorts 脚本",
    data.shortsScript || "- 无",
    "",
    "## 发布文案",
    data.releaseCopy || "- 无",
  ];
  
  return lines.join("\n");
}

export function generateDocxExport(data: ExportData): Buffer {
  // TODO: 使用 docx 库生成 Word 文档
  // import { Document, Packer, Paragraph, TextRun } from "docx";
  return Buffer.from("TODO");
}

// ============ 完整工作流 ============
export interface GenerationResult {
  summary?: object;
  lyrics?: string;
  sunoPrompt?: string;
  coverPrompt?: string;
  coverImageUrl?: string;
  shortsScript?: string;
  releaseCopy?: string;
  musicUrl?: string;  // Suno 生成
}

// 完整生成：文本 + 图片
// 注意：音乐生成需要用户自己在 Suno 操作
export async function generateComplete(
  goal: string,
  options?: { generateImage?: boolean }
): Promise<GenerationResult> {
  // 1. 生成文本内容（调用 GPT）
  const textResult = await generateTextContent(goal);
  
  let coverImageUrl: string | undefined;
  
  // 2. 生成封面图片（可选）
  if (options?.generateImage && textResult.coverPrompt) {
    coverImageUrl = await generateCoverImage(textResult.coverPrompt) || undefined;
  }
  
  return {
    ...textResult,
    coverImageUrl,
  };
}

// 内部：只生成文本内容
async function generateTextContent(goal: string): Promise<GenerationResult> {
  const prompt = `用户目标：${goal}

请为音乐创作生成以下内容，用 JSON 格式：
{
  "summary": { "theme": "主题", "bpm": "BPM", "key": "调性", "structure": "结构", "hook": "Hook句" },
  "lyrics": "歌词方向和建议",
  "sunoPrompt": "Suno 提示词",
  "coverPrompt": "封面图片提示词（英文，要具体视觉效果）",
  "shortsScript": "短视频脚本",
  "releaseCopy": "发布文案"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("AI 返回为空");
  }

  return JSON.parse(content);
}