#!/bin/bash
# VocalOS 自动部署脚本

echo "=== VocalOS Vercel 部署 ==="

# 安装 Vercel CLI
npm i -g vercel

# 进入项目目录
cd ~/.hermes/projects/vocalos

# 部署
vercel --prod --yes

echo "=== 完成 ==="