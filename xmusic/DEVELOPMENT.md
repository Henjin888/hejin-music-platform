# XMUSIC 开发文档（Agent 执行版）

## 产品定位
音乐产业的"链上投行基础设施" —— 让独立歌手像创业公司一样融资运作。

## 核心用户路径

### 1. 登录认证（3种方式）
```
用户触发登录
├── 区块链钱包（Web3Auth）
│   └── 签名 nonce → 验证 → 生成 token
├── 社交 OAuth（Google/Apple/Facebook）
│   └── OAuth2 流程 → 获取用户信息 → 生成 token
└── 手机号验证码
    └── 短信验证 → 生成 token
```

### 2. 歌手路径
```
注册/登录 → 开通付费订阅 → 发布音频 → 创建融资项目 → 管理收益
```

### 3. 投资人路径
```
注册/登录 → 浏览/搜索歌手 → 投资 → 查看收益 → 提现
```

## 前端架构

### 页面清单
| 页面 | 路由 | 功能 |
|:---|:---|:---|
| 首页 | `/` | 搜索栏、附近音乐人、Banner、语言切换 |
| 登录 | `/login` | 钱包/社交/手机号三方式登录 |
| 歌手主页 | `/artist/[id]` | 个人资料、音频列表、融资状态 |
| 发布页 | `/create` | 上传音频、创建融资项目 |
| 搜索页 | `/explore` | 筛选、排序、地图模式 |
| 个人中心 | `/profile` | 设置、钱包、投资记录 |

### 技术栈
- **框架**: Next.js 14 + React + TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **Web3**: Web3Auth + wagmi + viem
- **地图**: Mapbox/高德地图
- **多语言**: next-i18next

## 后端架构

### 服务拆分
```
┌─────────────────────────────────────────┐
│              API Gateway                │
└─────────────────────────────────────────┘
         │              │              │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ 用户服务 │    │ 音频服务 │    │ 统计服务 │
    │ (Auth)  │    │ (Media) │    │ (Data)  │
    └────┬────┘    └────┬────┘    └────┬────┘
         │              │              │
    ┌────▼──────────────▼──────────────▼────┐
    │           智能合约层                  │
    │  XMusicFactory | ArtistProject | XMToken  │
    └─────────────────────────────────────────┘
```

### 智能合约架构

#### XMusicFactory（工厂合约）
```solidity
function createProject(
    string memory _projectName,
    address _artist,
    uint256 _targetAmount,
    Allocation memory _allocation
) external returns (address projectAddress);
```

#### ArtistProject（项目合约）
```solidity
// 角色份额（基点 10000 = 100%）
struct Allocation {
    uint256 artistShare;      // 40% = 4000
    uint256 investorShare;    // 35% = 3500
    uint256 agentShare;       // 15% = 1500
    uint256 communityShare;   // 10% = 1000
}

// 核心功能
function invest(uint256 _shareAmount) external payable;
function addRevenue() external payable;
function distributeRewards() external;
function claimRewards() external;
```

#### 收益分配规则
| 角色 | 份额 | 说明 |
|:---|:---|:---|
| 歌手 | 40% | 项目创始人 |
| 投资人 | 35% | 出资方 |
| 经纪人/团队 | 15% | 运营支持 |
| 社区/粉丝 | 10% | 推广贡献 |
| 平台 | 5% | 服务费（从歌手份额扣除）|
| 推荐人 | 1% | 成功推荐奖励 |

## 音频存储方案

### 技术选型
```
上传流程:
歌手上传 → 前端压缩 → IPFS 存储 → 返回 CID → 链上记录元数据

播放流程:
用户请求 → 查询链上 CID → IPFS 网关/CDN → 流式播放
```

### 存储架构
- **主存储**: IPFS/Filecoin（去中心化）
- **加速层**: Cloudflare IPFS 网关 / 自建 CDN
- **备份**: Arweave（永久存储重要作品）
- **元数据**: 链上存储文件哈希、授权信息

## API 接口规范

### 认证接口
```http
POST /api/auth/nonce
Response: { nonce: string }

POST /api/auth/verify
Body: { 
  type: "wallet" | "oauth" | "phone",
  signature?: string,
  address?: string,
  provider?: string,
  token?: string,
  phone?: string,
  code?: string
}
Response: { token: string, user: User }
```

### 音频接口
```http
POST /api/audio/upload
Headers: Authorization: Bearer {token}
Body: FormData { file: Blob, metadata: JSON }
Response: { cid: string, url: string }

GET /api/audio/:id
Response: { id, cid, url, metadata, artist, stats }
```

### 融资接口
```http
GET /api/projects
Query: { page, limit, genre, location, status }
Response: { projects[], total }

POST /api/projects/:id/invest
Body: { amount: number }
Response: { txHash, shares }

GET /api/projects/:id/revenue
Response: { totalRevenue, yourShare, history[] }
```

## 数据库设计

### 用户表 (users)
```sql
id: UUID PRIMARY KEY
wallet_address: VARCHAR(42) UNIQUE
email: VARCHAR(255)
phone: VARCHAR(20)
avatar: VARCHAR(255)
role: ENUM('artist', 'investor', 'agent', 'fan')
created_at: TIMESTAMP
```

### 音频表 (audios)
```sql
id: UUID PRIMARY KEY
artist_id: UUID FOREIGN KEY
cid: VARCHAR(64) -- IPFS CID
title: VARCHAR(255)
description: TEXT
duration: INTEGER
genre: VARCHAR(50)
play_count: INTEGER
created_at: TIMESTAMP
```

### 项目表 (projects)
```sql
id: UUID PRIMARY KEY
contract_address: VARCHAR(42) UNIQUE
artist_id: UUID FOREIGN KEY
title: VARCHAR(255)
description: TEXT
target_amount: DECIMAL(20, 8)
raised_amount: DECIMAL(20, 8)
status: ENUM('funding', 'completed', 'closed')
allocation: JSON
created_at: TIMESTAMP
```

## 开发任务清单（Agent 执行版）

### Phase 1: 基础架构（Day 1-3）
- [ ] 初始化 Next.js 项目 + Tailwind + shadcn
- [ ] 配置 Web3Auth + wagmi
- [ ] 搭建多语言框架（中/英/日/韩）
- [ ] 部署本地测试链（Hardhat/Foundry）

### Phase 2: 认证系统（Day 4-6）
- [ ] 实现钱包登录（签名验证）
- [ ] 集成 Google/Apple OAuth
- [ ] 实现手机号验证码（Twilio/阿里云）
- [ ] 统一登录状态管理

### Phase 3: 前端页面（Day 7-12）
- [ ] 首页（搜索 + 地图 + Banner）
- [ ] 歌手主页（抖音风格）
- [ ] 发布页（音频上传 + 融资创建）
- [ ] 个人中心（投资记录 + 设置）

### Phase 4: 音频系统（Day 13-16）
- [ ] IPFS 上传接口
- [ ] 音频播放器组件
- [ ] 流媒体优化（CDN）
- [ ] 元数据管理

### Phase 5: 智能合约（Day 17-22）
- [ ] 编写 XMusicFactory 合约
- [ ] 编写 ArtistProject 合约
- [ ] 编写 XMToken 合约
- [ ] 部署测试网 + 前端对接

### Phase 6: 融资功能（Day 23-26）
- [ ] 投资流程（USDC 支付）
- [ ] 收益分配逻辑
- [ ] 推荐奖励系统
- [ ] 付费订阅功能

### Phase 7: 测试上线（Day 27-30）
- [ ] 集成测试
- [ ] 安全审计
- [ ] 性能优化
- [ ] 主网部署

## 环境变量配置

```env
# 前端
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_CHAIN_ID=11155111

# 后端
DATABASE_URL=
REDIS_URL=
JWT_SECRET=

# 第三方服务
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
IPFS_INFURA_ID=
IPFS_INFURA_SECRET=

# 合约
PRIVATE_KEY=
ETHERSCAN_API_KEY=
```

## 部署检查清单

- [ ] 合约已部署到主网并验证
- [ ] 前端已构建并部署到 Vercel
- [ ] 后端服务已部署并配置域名
- [ ] 数据库已迁移并备份
- [ ] 监控和日志已配置
- [ ] 文档已更新
