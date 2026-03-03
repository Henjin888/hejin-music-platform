# XMUSIC 完整功能清单

## 核心定位
**Web3音乐金融投资平台** - 音乐现金流的资产化和分配层

## 用户角色系统

### 1. 基础角色
- **粉丝 (Fan)** - 浏览、投资、关注艺人
- **音乐人 (Musician)** - 创建项目、管理投资、查看分析
- **管理员 (Admin)** - 审核项目、KYC验证、处理争议

### 2. 投资等级
| 等级 | 最低投资 | 权益 |
|:---|:---|:---|
| Supporter | $10 | 基础收益分成 |
| Fan | $50 | 优先访问权 |
| Collector | $200 | 独家内容 |
| Producer | $500 | 决策参与权 |

### 3. 团队角色
| 角色 | 最低投资 | 收益分成 | 职责 |
|:---|:---|:---|:---|
| 运营团队 | $1,000 | 5% | 运营、推广、招募 |
| 投资人 | $100 | 按比例 | 提供资金支持 |
| 经纪人 | $500 | 3% | 连接资源、组织演出 |
| 星推官 | $200 | 2% | 社交媒体推广 |
| 粉丝 | $10 | 按比例 | 支持艺人 |

## 核心功能模块

### 1. 认证系统
- 邮箱/密码注册登录
- Web3钱包连接（MetaMask、WalletConnect等）
- **KYC身份验证（三步）**:
  1. 个人信息：姓名、出生日期、国籍
  2. 身份证明：护照/身份证/驾照上传
  3. 验证照片：自拍验证

### 2. 投资系统
- 投资等级体系
- 团队投资系统
- **里程碑资金托管**:
  - 智能合约托管所有投资资金
  - 按里程碑分批释放资金
  - 状态：待处理、进行中、已完成、逾期

### 3. 推荐系统
| 等级 | 最低推荐 | 佣金比例 |
|:---|:---|:---|
| Starter | 0 | 2% |
| Pro | 10 | 3% |
| Elite | 50 | 5% |

### 4. 多语言支持（10种）
1. 简体中文 (zh) - 默认
2. 繁体中文 (zht)
3. 英语 (en)
4. 日语 (ja)
5. 韩语 (ko)
6. 西班牙语 (es)
7. 法语 (fr)
8. 德语 (de)
9. 葡萄牙语 (pt)
10. 俄语 (ru)

### 5. 货币支持
USD, CNY, EUR, GBP, JPY, KRW

## 页面结构

```
/                    # Feed - 首页动态
/discover            # Discover - 发现艺人
/artist/:id          # ArtistProfile - 艺人详情
/funding/:id         # FundingDetail - 投资详情
/investments         # Investments - 我的投资
/profile             # Profile - 个人资料
/musician            # MusicianDashboard - 音乐人仪表盘
/create-project      # CreateProject - 创建项目
/admin               # AdminDashboard - 管理员后台
/chat                # Chat - 聊天页面
/auth                # Auth - 登录/注册
/map                 # Map - 附近音乐人
```

## 组件清单

### 导航
- BottomNav - 底部导航栏（移动端）
- Sidebar - 侧边栏（桌面端）

### 选择器
- LanguageSelector - 语言选择
- CurrencySelector - 货币选择

### Web3
- Web3Wallet - 钱包连接

### 业务
- ReferralSystem - 推荐系统
- TeamSection - 团队招募
- CapTable - 股权分配表
- Milestones - 里程碑追踪
- InvestmentFlow - 投资流程
- KYCVerification - KYC验证

## 技术栈
- React 18 + TypeScript
- Vite 7
- Tailwind CSS
- i18next
- Web3 (原生以太坊API)
