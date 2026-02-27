# 股票价格监控系统

监控AI算力、固态电池、人形机器人三大热门方向的6只标的，当股价触及目标价位时自动发送通知。

## 📊 监控标的

### AI算力方向
| 名称 | 代码 | 当前价 | 目标买入价 | 止损价 | 目标卖出价 |
|------|------|--------|-----------|--------|-----------|
| 寒武纪 | 688256.SH | 1182.50 | 950.00 | 850.00 | 1300.00 |
| 澜起科技 | 688008.SH | 161.82 | 140.00 | 120.00 | 200.00 |

### 固态电池方向
| 名称 | 代码 | 当前价 | 目标买入价 | 止损价 | 目标卖出价 |
|------|------|--------|-----------|--------|-----------|
| 宁德时代 | 300750.SZ | 344.09 | 320.00 | 280.00 | 450.00 |
| 先导智能 | 300450.SZ | 54.58 | 45.00 | 38.00 | 70.00 |

### 人形机器人方向
| 名称 | 代码 | 当前价 | 目标买入价 | 止损价 | 目标卖出价 |
|------|------|--------|-----------|--------|-----------|
| 拓普集团 | 601689.SH | 67.71 | 58.00 | 50.00 | 85.00 |
| 三花智控 | 002050.SZ | 51.21 | 45.00 | 38.00 | 65.00 |

## 🚀 快速开始

### 1. 初始化配置
```bash
python3 stock_monitor.py init
```

### 2. 手动检查股价
```bash
python3 stock_monitor.py check
```

### 3. 查看投资组合
```bash
python3 stock_monitor.py show
```

## ⚙️ 定时任务设置

系统已配置cron定时任务，每天早上7:00自动检查股价：

```bash
# 查看定时任务
crontab -l

# 输出:
# 股票价格监控系统 - 每天早上7:00检查
0 7 * * * /root/.openclaw/workspace/stock_monitor.sh
```

## 🛠️ 管理命令

### 更新股票价格（手动）
```bash
python3 stock_monitor.py update 寒武纪 1150
```

### 更新目标价格
```bash
# 更新目标买入价
python3 stock_monitor.py target 寒武纪 target_buy 900

# 更新止损价
python3 stock_monitor.py target 寒武纪 stop_loss 800

# 更新目标卖出价
python3 stock_monitor.py target 寒武纪 target_sell 1400
```

### 重置提醒状态
```bash
python3 stock_monitor.py reset
```

## 📁 文件说明

| 文件 | 说明 |
|------|------|
| `stock_monitor.py` | 主监控程序 |
| `stock_notifier.py` | 通知模块 |
| `stock_monitor.sh` | 定时任务脚本 |
| `~/.stock_monitor_config.json` | 股票配置数据 |
| `~/.stock_alert_state.json` | 提醒状态记录 |
| `stock_monitor.log` | 运行日志 |

## 🔔 提醒规则

- **买入提醒**: 当股价 ≤ 目标买入价时触发 🟢
- **止损提醒**: 当股价 ≤ 止损价时触发 🔴
- **卖出提醒**: 当股价 ≥ 目标卖出价时触发 🟡

每天每个提醒类型只触发一次，避免重复通知。

## 📈 数据来源

系统使用以下数据源获取实时股价：
1. 腾讯财经API (qt.gtimg.cn)
2. 新浪财经API (hq.sinajs.cn)
3. 东方财富API (push2.eastmoney.com)

## 🔧 扩展通知方式

如需启用钉钉/飞书/企业微信通知，编辑 `stock_notifier.py`：

```python
NOTIFICATION_CONFIG = {
    "webhook_enabled": True,
    "webhook_url": "https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN",
    "webhook_type": "dingtalk",  # 可选: dingtalk, feishu, wechat
}
```

## ⚠️ 免责声明

本系统仅供学习研究使用，不构成投资建议。股市有风险，投资需谨慎。
