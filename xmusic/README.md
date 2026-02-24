# XMUSIC - 音乐现金流资产化平台

## 项目概述

XMUSIC 是一个去中心化的音乐投资平台，让每个独立歌手都能像创业公司一样运作自己的音乐事业。通过将音乐收益权代币化，连接歌手、投资人、经纪人和粉丝，构建全新的音乐产业生态。

## 核心概念

```
每个歌手项目 = 一个小公司
├── 创始人（歌手）- 40% 份额
├── 投资人 - 35% 份额  
├── 经纪人/运营 - 15% 份额
└── 社区储备 - 10% 份额
```

## 技术架构

### 前端 (Next.js 14)
- **框架**: Next.js 14 + React + TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **Web3**: RainbowKit + wagmi + viem
- **部署**: 静态导出，可部署到任何 CDN

### 智能合约 (Solidity)
- **工厂合约**: `XMusicFactory.sol` - 创建新项目
- **项目合约**: `ArtistProject.sol` - 管理单个项目的投资和分配
- **平台代币**: `XMToken.sol` - 平台治理和激励
- **开发框架**: Foundry

## 功能模块

### 已完成功能

#### 1. 首页 (Landing Page)
- 品牌展示和平台介绍
- 热门项目展示
- 角色说明（歌手/投资人/经纪人）
- 平台数据统计

#### 2. 项目市场
- 项目卡片列表
- 融资进度展示
- 预期回报显示
- 快速筛选

#### 3. 项目详情页
- 项目介绍和团队信息
- 份额分配可视化
- 投资入口
- 项目动态时间线

#### 4. 投资面板 (Dashboard)
- 投资组合概览
- 收益统计
- 交易记录
- 治理投票（预留）

#### 5. 项目创建向导
- 4步创建流程
- 基础信息设置
- 融资参数配置
- 团队角色分配
- 发布确认

### 智能合约功能

#### XMusicFactory
- 创建新的歌手项目
- 管理平台费率（2.5%）
- 项目注册表

#### ArtistProject
- 份额代币（ERC20）
- 投资功能
- 收益录入和分配
- 治理权映射

## 项目结构

```
xmusic/
├── apps/
│   └── web/                    # Next.js 前端
│       ├── app/
│       │   ├── page.tsx        # 首页
│       │   ├── layout.tsx      # 根布局
│       │   ├── project/
│       │   │   └── [id]/
│       │   │       └── page.tsx   # 项目详情
│       │   ├── dashboard/
│       │   │   └── page.tsx       # 投资面板
│       │   └── create/
│       │       └── page.tsx       # 创建项目
│       ├── components/
│       │   ├── ui/             # shadcn 组件
│       │   └── web3-provider.tsx  # Web3 配置
│       └── lib/
│           └── utils.ts
├── contracts/                  # 智能合约
│   ├── src/
│   │   ├── XMusicFactory.sol
│   │   ├── ArtistProject.sol
│   │   └── XMToken.sol
│   ├── test/
│   │   └── XMusic.t.sol
│   └── script/
│       └── Deploy.s.sol
└── README.md
```

## 快速开始

### 前端开发

```bash
cd apps/web

# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000

### 合约开发

```bash
cd contracts

# 安装 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 安装依赖
forge install

# 编译
forge build

# 测试
forge test

# 部署本地
anvil
forge script script/Deploy.s.sol --rpc-url localhost --broadcast
```

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

## 页面路由

| 路径 | 功能 |
|:---|:---|
| `/` | 首页 - 项目市场 |
| `/project/[id]` | 项目详情页 |
| `/dashboard` | 投资面板 |
| `/create` | 创建新项目 |

## 下一步开发计划

### Phase 1: 核心功能完善
- [ ] 钱包连接真实交互
- [ ] 投资功能合约对接
- [ ] 收益领取功能
- [ ] 项目创建合约对接

### Phase 2: 高级功能
- [ ] 二级市场交易
- [ ] 治理投票系统
- [ ] 收益自动抓取
- [ ] 多链支持

### Phase 3: 生态扩展
- [ ] 移动端适配
- [ ] 社交功能
- [ ] 数据分析面板
- [ ] API 开放

## 技术决策

### 为什么用 ERC20 而不是 NFT？
- 收益权需要可分割性
- 便于计算分配比例
- 更好的流动性

### 为什么先手动录入收益？
- 自动抓取需要流媒体 API 权限
- 手动验证需求后再自动化
- 降低初期复杂度

### 为什么每个项目独立合约？
- 风险隔离
- 灵活定制分配规则
- 便于审计

## 贡献

欢迎提交 Issue 和 PR。

## 许可证

MIT
