# XMUSIC - 去中心化音乐投资平台

一个让独立歌手像创业公司一样运作的音乐现金流资产化平台。

## 核心概念

每个歌手项目 = 一个小公司
- 创始人（歌手）- 40% 份额
- 投资人 - 35% 份额  
- 经纪人/运营 - 15% 份额
- 社区储备 - 10% 份额

## 技术栈

- **前端**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Web3**: RainbowKit + wagmi + viem
- **合约**: Solidity + Foundry

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页 - 项目市场
│   ├── layout.tsx         # 根布局
│   ├── project/[id]/      # 项目详情页
│   ├── dashboard/         # 投资面板
│   ├── create/            # 创建项目
│   └── ...
├── components/            # React 组件
│   └── ui/               # shadcn/ui 组件
├── contracts/            # 智能合约
│   ├── src/             # 合约源码
│   │   ├── XMusicFactory.sol
│   │   ├── ArtistProject.sol
│   │   └── XMToken.sol
│   ├── test/            # 合约测试
│   └── script/          # 部署脚本
├── lib/                  # 工具函数
├── public/              # 静态资源
└── package.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建
npm run build
```

## 合约开发

```bash
cd contracts

# 编译
forge build

# 测试
forge test

# 部署
forge script script/Deploy.s.sol --rpc-url localhost --broadcast
```

## 环境变量

创建 `.env.local`:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_CHAIN_ID=11155111
```

## 许可证

MIT
