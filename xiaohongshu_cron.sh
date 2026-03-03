#!/bin/bash
# 小红书自动发布定时任务脚本
# 添加到 crontab: crontab -e

# 每天 10:00 和 20:00 自动发布
# 0 10,20 * * * /root/.openclaw/workspace/xiaohongshu_cron.sh

cd /root/.openclaw/workspace

# 激活虚拟环境（如果有）
# source venv/bin/activate

# 运行发布脚本
python3 xiaohongshu_poster.py >> logs/xiaohongshu_$(date +\%Y\%m\%d).log 2>&1

# 发送通知（可选）
echo "小红书发布任务完成 - $(date)" | tee -a logs/cron.log
