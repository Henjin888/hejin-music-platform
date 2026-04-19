// OpenAI Client
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;

export const isAIConfigured = !!apiKey;

// 生成结果（调用 AI）
export async function generateResults(goal: string) {
  if (!openai) {
    throw new Error("OpenAI API Key 未配置");
  }

  const prompt = `用户目标：${goal}

请为音乐创作生成以下内容：
1. 目标摘要（主题、BPM、Key、曲风结构、Hook）
2. 歌词方向（Verse、Pre-Chorus、Chorus、Bridge 结构建议和关键句）
3. Suno 提示词（可直接用于 Suno AI 音乐的提示词，要有风格描述、乐器、情绪）
4. 封面提示词（用于 AI 生成封面的视觉描述）
5. Shorts 脚本（15-60秒短视频的镜头规划和字幕）
6. 发布文案（适合抖音/小红书/微博的标题和简介）

请用 JSON 格式输出：
{
  "summary": { "theme": "", "bpm": "", "key": "", "structure": "", "hook": "" },
  "lyrics": "",
  "sunoPrompt": "",
  "coverPrompt": "",
  "shortsScript": "",
  "releaseCopy": ""
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