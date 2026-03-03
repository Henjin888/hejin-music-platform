// 合约配置 - Sepolia 测试网
export const CONTRACTS = {
  // 工厂合约
  XMusicFactory: {
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`, // 部署后更新
    abi: [
      {
        "inputs": [{"name": "_treasury", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {"name": "_tokenName", "type": "string"},
          {"name": "_tokenSymbol", "type": "string"},
          {"name": "_projectName", "type": "string"},
          {"name": "_description", "type": "string"},
          {"name": "_genre", "type": "string"},
          {"name": "_location", "type": "string"},
          {"name": "_artist", "type": "address"},
          {"name": "_agent", "type": "address"},
          {"name": "_targetAmount", "type": "uint256"},
          {"name": "_minInvestment", "type": "uint256"},
          {"name": "_totalShares", "type": "uint256"},
          {"name": "_pricePerShare", "type": "uint256"},
          {"name": "_duration", "type": "uint256"},
          {
            "name": "_allocation",
            "type": "tuple",
            "components": [
              {"name": "artistShare", "type": "uint256"},
              {"name": "investorShare", "type": "uint256"},
              {"name": "agentShare", "type": "uint256"},
              {"name": "communityShare", "type": "uint256"}
            ]
          }
        ],
        "name": "createProject",
        "outputs": [{"name": "projectAddress", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getProjectCount",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"name": "_artist", "type": "address"}],
        "name": "getArtistProjects",
        "outputs": [{"name": "", "type": "address[]"}],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  },
  
  // 平台代币
  XMToken: {
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`, // 部署后更新
    abi: [
      {
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_amount", "type": "uint256"}, {"name": "_category", "type": "string"}],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  }
};

// 项目合约 ABI（通用）
export const ARTIST_PROJECT_ABI = [
  {
    "inputs": [{"name": "_shareAmount", "type": "uint256"}],
    "name": "invest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_holder", "type": "address"}],
    "name": "getPendingRewards",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRaised",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "projectInfo",
    "outputs": [
      {"name": "name", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "genre", "type": "string"},
      {"name": "location", "type": "string"},
      {"name": "artist", "type": "address"},
      {"name": "agent", "type": "address"},
      {"name": "targetAmount", "type": "uint256"},
      {"name": "minInvestment", "type": "uint256"},
      {"name": "totalShares", "type": "uint256"},
      {"name": "pricePerShare", "type": "uint256"},
      {"name": "startTime", "type": "uint256"},
      {"name": "endTime", "type": "uint256"},
      {"name": "status", "type": "uint8"},
      {"name": "metadataURI", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Sepolia 测试网配置
export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  name: "Sepolia",
  rpcUrl: "https://rpc.sepolia.org",
  blockExplorer: "https://sepolia.etherscan.io"
};
