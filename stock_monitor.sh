#!/bin/bash
# 股票价格监控定时任务脚本
# 每天早上7:00执行

# 设置环境变量
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
export PYTHONPATH="/root/.openclaw/workspace:$PYTHONPATH"

# 日志文件
LOG_FILE="/root/.openclaw/workspace/stock_monitor.log"

# 执行监控脚本
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始执行股票价格监控..." >> "$LOG_FILE"

python3 /root/.openclaw/workspace/stock_monitor.py check >> "$LOG_FILE" 2>&1

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 股票价格监控执行成功" >> "$LOG_FILE"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 股票价格监控执行失败，退出码: $EXIT_CODE" >> "$LOG_FILE"
fi

echo "----------------------------------------" >> "$LOG_FILE"

exit $EXIT_CODE
