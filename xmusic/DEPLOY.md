# XMUSIC 合约部署指南

## 环境变量配置

创建 `.env` 文件：

```bash
# 私钥（不要提交到Git！）
PRIVATE_KEY=your_private_key_here

# Sepolia RPC
SEPOLIA_RPC_URL=https://rpc.sepolia.org
# 或
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key

# Etherscan API（用于验证）
ETHERSCAN_API_KEY=your_etherscan_api_key

# 平台国库地址
TREASURY_ADDRESS=your_treasury_address
```

## 部署步骤

### 1. 启动本地节点测试
```bash
cd contracts
anvil
```

### 2. 本地部署测试
```bash
source .env
forge script script/Deploy.s.sol --rpc-url localhost --broadcast
```

### 3. Sepolia 测试网部署
```bash
source .env
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify
```

## 部署后更新

将部署后的合约地址更新到前端配置：

```typescript
// apps/web/lib/contracts.ts
export const CONTRACTS = {
  XMusicFactory: {
    address: "0x...", // 部署后的地址
    // ...
  },
  XMToken: {
    address: "0x...", // 部署后的地址
    // ...
  }
};
```

## 合约地址记录

### Sepolia 测试网
| 合约 | 地址 | 部署时间 |
|:---|:---|:---|
| XMToken | 待部署 | - |
| XMusicFactory | 待部署 | - |
| 示例项目 | 待部署 | - |

### 主网（未来）
| 合约 | 地址 | 部署时间 |
|:---|:---|:---|
| XMToken | 待部署 | - |
| XMusicFactory | 待部署 | - |
