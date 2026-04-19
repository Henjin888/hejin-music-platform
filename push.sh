#!/bin/bash
# VocalOS 推送脚本

cd ~/.hermes/projects/vocalos

# 添加远程仓库
git remote add origin https://github.com/Henjin888/hejin-music-platform.git

# 推送
git push -u origin main

echo "完成！"