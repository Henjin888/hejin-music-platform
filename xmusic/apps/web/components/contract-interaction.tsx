"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

// 合约 ABI（简化版）
const ARTIST_PROJECT_ABI = [
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
  }
];

interface ContractInteractionProps {
  projectAddress: string;
}

export default function ContractInteraction({ projectAddress }: ContractInteractionProps) {
  const { address, isConnected } = useAccount();
  const [investAmount, setInvestAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // 读取项目信息
  const { data: projectInfo } = useReadContract({
    address: projectAddress as `0x${string}`,
    abi: ARTIST_PROJECT_ABI,
    functionName: "projectInfo",
  });

  // 读取已筹集金额
  const { data: totalRaised } = useReadContract({
    address: projectAddress as `0x${string}`,
    abi: ARTIST_PROJECT_ABI,
    functionName: "totalRaised",
  });

  // 读取待领取收益
  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
    address: projectAddress as `0x${string}`,
    abi: ARTIST_PROJECT_ABI,
    functionName: "getPendingRewards",
    args: address ? [address] : undefined,
  });

  // 投资
  const { 
    writeContract: invest, 
    data: investHash,
    isPending: isInvestPending,
    error: investError 
  } = useWriteContract();

  // 领取收益
  const { 
    writeContract: claimRewards, 
    data: claimHash,
    isPending: isClaimPending,
    error: claimError 
  } = useWriteContract();

  // 等待交易确认
  const { isLoading: isInvestConfirming, isSuccess: isInvestSuccess } = useWaitForTransactionReceipt({
    hash: investHash,
  });

  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  // 处理投资
  const handleInvest = async () => {
    if (!investAmount || isNaN(Number(investAmount))) return;
    
    setIsInvesting(true);
    try {
      const shares = BigInt(Math.floor(Number(investAmount) / 0.01)); // 假设每份0.01 ETH
      const value = parseEther(investAmount);
      
      invest({
        address: projectAddress as `0x${string}`,
        abi: ARTIST_PROJECT_ABI,
        functionName: "invest",
        args: [shares],
        value,
      });
    } catch (error) {
      console.error("Investment error:", error);
    }
  };

  // 处理领取收益
  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      claimRewards({
        address: projectAddress as `0x${string}`,
        abi: ARTIST_PROJECT_ABI,
        functionName: "claimRewards",
      });
    } catch (error) {
      console.error("Claim error:", error);
    }
  };

  // 投资成功后刷新数据
  useEffect(() => {
    if (isInvestSuccess) {
      setInvestAmount("");
      setIsInvesting(false);
      refetchRewards();
    }
  }, [isInvestSuccess, refetchRewards]);

  // 领取成功后刷新数据
  useEffect(() => {
    if (isClaimSuccess) {
      setIsClaiming(false);
      refetchRewards();
    }
  }, [isClaimSuccess, refetchRewards]);

  if (!isConnected) {
    return (
      <Card className="bg-[#181818] border-none">
        <CardContent className="p-6 text-center">
          <Wallet className="w-12 h-12 text-[#404040] mx-auto mb-4" />
          <p className="text-[#B3B3B3] mb-4">连接钱包以投资此项目</p>
          <Button className="bg-[#1DB954] hover:bg-[#1ED760] text-black">
            连接钱包
          </Button>
        </CardContent>
      </Card>
    );
  }

  const targetAmount = projectInfo && Array.isArray(projectInfo) && projectInfo[6] ? formatEther(projectInfo[6] as bigint) : "0";
  const raisedAmount = totalRaised && typeof totalRaised === 'bigint' ? formatEther(totalRaised) : "0";
  const progress = targetAmount !== "0" 
    ? (Number(raisedAmount) / Number(targetAmount)) * 100 
    : 0;
  const rewards = pendingRewards && typeof pendingRewards === 'bigint' ? formatEther(pendingRewards) : "0";

  return (
    <div className="space-y-4">
      {/* 投资卡片 */}
      <Card className="bg-[#181818] border-none">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#1DB954]" />
            投资此项目
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 进度 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#B3B3B3]">融资进度</span>
              <span className="font-medium">
                {Number(raisedAmount).toFixed(2)} / {Number(targetAmount).toFixed(2)} ETH
              </span>
            </div>            
            <Progress value={progress} className="h-2 bg-[#404040]" />
            <p className="text-xs text-[#B3B3B3] text-right">{progress.toFixed(1)}%</p>
          </div>

          {/* 投资输入 */}
          <div className="space-y-2">
            <Label className="text-sm text-[#B3B3B3]">投资金额 (ETH)</Label>
            <Input
              type="number"
              placeholder="0.1"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              className="bg-[#282828] border-none text-white"
              step="0.01"
              min="0.01"
            />
            <p className="text-xs text-[#6a6a6a]">
              预计获得 {investAmount ? Math.floor(Number(investAmount) / 0.01) : 0} 份
            </p>
          </div>

          {/* 投资按钮 */}
          <Button
            onClick={handleInvest}
            disabled={!investAmount || isInvestPending || isInvestConfirming}
            className="w-full bg-[#1DB954] hover:bg-[#1ED760] text-black disabled:opacity-50"
          >
            {isInvestPending || isInvestConfirming ? (
              "处理中..."
            ) : (
              "确认投资"
            )}
          </Button>

          {/* 错误提示 */}
          {investError && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>投资失败，请重试</span>
            </div>
          )}

          {/* 成功提示 */}
          {isInvestSuccess && (
            <div className="flex items-center gap-2 text-[#1DB954] text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>投资成功！</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 收益卡片 */}
      {Number(rewards) > 0 && (
        <Card className="bg-gradient-to-r from-[#1DB954]/20 to-[#1DB954]/5 border-[#1DB954]/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1DB954]" />
              可领取收益
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#1DB954]">{Number(rewards).toFixed(4)} ETH</p>
              <p className="text-sm text-[#B3B3B3]">待领取收益</p>
            </div>

            <Button
              onClick={handleClaim}
              disabled={isClaimPending || isClaimConfirming}
              className="w-full bg-white text-black hover:bg-[#F0F0F0] disabled:opacity-50"
            >
              {isClaimPending || isClaimConfirming ? (
                "领取中..."
              ) : (
                "领取收益"
              )}
            </Button>

            {isClaimSuccess && (
              <div className="flex items-center gap-2 text-[#1DB954] text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>领取成功！</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
