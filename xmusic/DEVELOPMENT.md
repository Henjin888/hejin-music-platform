# XMUSIC - 音乐现金流资产化平台

## 项目概述

XMUSIC 是一个去中心化的音乐投资平台，让每个独立歌手都能像创业公司一样运作自己的音乐事业。通过将音乐收益权代币化，连接歌手、投资人、经纪人和粉丝，构建全新的音乐产业生态。

**核心理念：**
```
每个歌手项目 = 一个小公司
├── 创始人（歌手）- 40% 份额
├── 投资人 - 35% 份额  
├── 经纪人/运营 - 15% 份额
└── 社区储备 - 10% 份额
```

---

## 技术栈

### 前端
| 技术 | 版本 | 用途 |
|:---|:---|:---|
| Next.js | 16.1.6 | React 框架 |
| React | 19.2.3 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 样式框架 |
| shadcn/ui | 3.8.5 | UI 组件库 |
| RainbowKit | 2.2.10 | 钱包连接 |
| wagmi | 2.19.5 | Web3 交互 |
| viem | 2.46.2 | 以太坊工具 |

### 智能合约
| 技术 | 用途 |
|:---|:---|
| Solidity | 合约开发 |
| Foundry | 开发框架 |
| OpenZeppelin | 安全合约库 |

---

## 项目结构

```
xmusic/
├── apps/
│   └── web/                    # Next.js 前端应用
│       ├── app/                # App Router 页面
│       │   ├── page.tsx        # 首页 (Landing)
│       │   ├── layout.tsx      # 根布局
│       │   ├── explore/
│       │   │   └── page.tsx    # 探索页 (搜索+筛选)
│       │   ├── blog/
│       │   │   └── page.tsx    # 博客页
│       │   ├── cookie-policy/
│       │   │   └── page.tsx    # Cookie 政策页
│       │   ├── artist/[id]/
│       │   │   └── page.tsx    # 艺术家详情
│       │   ├── project/[id]/
│       │   │   └── page.tsx    # 项目详情
│       │   ├── dashboard/
│       │   │   └── page.tsx    # 用户仪表盘
│       │   └── create/
│       │       └── page.tsx    # 创建项目
│       ├── components/
│       │   ├── ui/             # shadcn/ui 组件
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── input.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── slider.tsx
│       │   │   └── ...
│       │   ├── audio-upload.tsx      # IPFS 音频上传
│       │   ├── audio-player.tsx      # 音频播放器
│       │   ├── contract-interaction.tsx  # 合约交互
│       │   └── web3-provider.tsx     # Web3 配置
│       ├── lib/
│       │   ├── utils.ts        # 工具函数
│       │   ├── contracts.ts    # 合约 ABI/地址
│       │   └── sample-data.ts  # 示例数据
│       ├── public/             # 静态资源
│       ├── next.config.ts      # Next.js 配置
│       └── package.json
├── contracts/                  # 智能合约
│   ├── src/
│   │   ├── XMusicFactory.sol   # 工厂合约
│   │   ├── ArtistProject.sol   # 项目合约
│   │   └── XMToken.sol         # 平台代币
│   ├── test/
│   │   └── XMusic.t.sol        # 测试文件
│   └── script/
│       └── Deploy.s.sol        # 部署脚本
└── README.md
```

---

## 页面路由

| 路径 | 功能描述 | 状态 |
|:---|:---|:---|
| `/` | 首页 - 项目市场展示 | ✅ 完成 |
| `/explore` | 探索页 - 搜索+筛选 | ✅ 完成 |
| `/blog` | 博客页 - 文章列表 | ✅ 完成 |
| `/cookie-policy` | Cookie 政策页 | ✅ 完成 |
| `/artist/[id]` | 艺术家详情页 | ✅ 完成 |
| `/project/[id]` | 项目详情页 | ✅ 完成 |
| `/dashboard` | 用户仪表盘 | ✅ 完成 |
| `/create` | 创建项目向导 | ✅ 完成 |
| `/login` | 登录/注册页 | ✅ 完成 |

---

## 功能模块详情

### 1. 首页 (Spotify 风格设计)

**文件：** `app/page.tsx`

**功能：**
- 品牌 Hero 区域（渐变背景）
- 平台数据统计卡片
- 热门音乐人网格展示
- 运作流程说明
- CTA 注册引导
- Footer 导航

**关键组件：**
- `ConnectButton` - RainbowKit 钱包连接
- `Card` - 项目卡片
- `Progress` - 融资进度条
- `Badge` - 标签

**链接状态：**
- "免费注册" → `/login` ✅
- "开始探索" → `/explore` ✅
- "发起融资" → `/create` ✅
- "查看全部" → `/explore` ✅

---

### 2. 探索页 (搜索+筛选)

**文件：** `app/explore/page.tsx`

**功能：**
- 实时搜索（名称/项目）
- 风格筛选（独立流行/电子/说唱/民谣/摇滚）
- 地区筛选（北京/上海/成都/杭州/深圳）
- 结果数量显示
- 空状态处理

**状态管理：**
```typescript
const [searchQuery, setSearchQuery] = useState("");
const [selectedGenre, setSelectedGenre] = useState("全部");
const [selectedLocation, setSelectedLocation] = useState("全部");
const [showFilters, setShowFilters] = useState(false);
```

**筛选逻辑：**
```typescript
const filteredArtists = ALL_ARTISTS.filter((artist) => {
  const matchesSearch = 
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.project.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesGenre = selectedGenre === "全部" || artist.genre === selectedGenre;
  const matchesLocation = selectedLocation === "全部" || artist.location === selectedLocation;
  return matchesSearch && matchesGenre && matchesLocation;
});
```

---

### 3. 博客页

**文件：** `app/blog/page.tsx`

**功能：**
- 文章列表网格展示
- 分类筛选栏
- 文章卡片（标题/摘要/作者/日期/阅读时间）
- 分类标签

**数据结构：**
```typescript
const BLOG_POSTS = [
  {
    id: 1,
    title: "XMUSIC 平台正式上线...",
    excerpt: "我们很高兴宣布...",
    author: "XMUSIC 团队",
    date: "2025-02-20",
    category: "平台动态",
    readTime: "5 分钟",
  },
  // ...
];
```

---

### 4. Cookie 政策页

**文件：** `app/cookie-policy/page.tsx`

**内容：**
- 完整的 Cookie 政策说明
- 使用条款
- 隐私相关说明

---

### 5. 音频组件

#### Audio Upload (IPFS)
**文件：** `components/audio-upload.tsx`

**功能：**
- 拖拽上传音频文件
- IPFS 存储集成
- 上传进度显示
- 文件类型验证

#### Audio Player
**文件：** `components/audio-player.tsx`

**功能：**
- 播放/暂停控制
- 进度条拖动
- 音量控制
- 播放列表支持

---

### 6. Web3 集成

**文件：** `components/web3-provider.tsx`

**配置：**
- RainbowKit 钱包连接
- wagmi 配置
- 支持的链（Sepolia 测试网）

**合约交互：**
**文件：** `lib/contracts.ts`

包含：
- XMusicFactory ABI
- ArtistProject ABI
- XMToken ABI
- 合约地址配置

---

## 智能合约

### XMusicFactory.sol
**功能：**
- 创建新的歌手项目
- 管理平台费率（2.5%）
- 项目注册表维护

### ArtistProject.sol
**功能：**
- ERC20 份额代币
- 投资功能
- 收益录入和分配
- 治理权映射

### XMToken.sol
**功能：**
- 平台治理代币
- 激励机制

---

## UI/UX 设计规范

### 色彩系统
| 用途 | 颜色值 |
|:---|:---|
| 主色调（Spotify 绿） | `#1DB954` |
| 悬停绿 | `#1ED760` |
| 背景色 | `#121212` |
| 卡片背景 | `#181818` |
| 卡片悬停 | `#282828` |
| 边框色 | `#282828` |
| 主文字 | `#FFFFFF` |
| 次要文字 | `#B3B3B3` |
| 辅助文字 | `#6A6A6A` |
| 页头背景 | `#070707` |

### 字体规范
- 主字体：系统默认无衬线字体
- 标题：font-bold, tracking-tight
- 正文：text-sm / text-base
- 辅助：text-xs

### 组件规范
- 按钮：rounded-full（全圆角）
- 卡片：rounded-md（小圆角）
- 输入框：rounded-full（搜索框）
- 进度条：h-1（细条）

---

## 开发指南

### 环境要求
- Node.js 20+
- npm / yarn / pnpm
- Foundry（合约开发）

### 安装依赖
```bash
cd apps/web
npm install
```

### 开发服务器
```bash
npm run dev
```
访问 http://localhost:3000

### 构建
```bash
npm run build
```

### 合约开发
```bash
cd contracts

# 编译
forge build

# 测试
forge test

# 部署
forge script script/Deploy.s.sol --rpc-url localhost --broadcast
```

---

## 环境变量

创建 `apps/web/.env.local`:
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
```

创建 `contracts/.env`:
```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
ETHERSCAN_API_KEY=your_etherscan_key
TREASURY_ADDRESS=your_treasury_address
```

---

## 待办事项

### 已完成 ✅
- [x] 首页 Spotify 风格设计
- [x] 探索页搜索+筛选功能
- [x] 博客页面
- [x] Cookie 政策页
- [x] 艺术家详情页
- [x] 项目详情页
- [x] 用户仪表盘
- [x] 创建项目向导
- [x] 首页按钮链接修复
- [x] IPFS 音频上传组件
- [x] 音频播放器组件

### 进行中 ⏳
- [ ] 通知页面 (Notifications.tsx)
- [ ] 页面滚动效果优化
- [ ] 动画过渡优化

### 待开发 📋
- [ ] 钱包连接真实交互
- [ ] 投资功能合约对接
- [ ] 收益领取功能
- [ ] 项目创建合约对接
- [ ] 二级市场交易
- [ ] 治理投票系统
- [ ] 收益自动抓取
- [ ] 多链支持

---

## 更新日志

### 2026-02-24
- 完成 IPFS 音频上传组件
- 完成音频播放器组件
- 添加 Slider UI 组件
- Git 提交 (3958603)

### 2026-02-25
- 确认搜索功能已实现
- 确认按钮链接已修复
- 确认 Blog 和 CookiePolicy 页面已创建
- 项目 MVP 核心功能完成度 80%

---

## 贡献指南

1. Fork 仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT
