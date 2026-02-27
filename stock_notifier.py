#!/usr/bin/env python3
"""
股票监控通知模块
支持多种通知方式：控制台、日志、Webhook等
"""

import os
import sys
import json
from datetime import datetime

# 通知配置
NOTIFICATION_CONFIG = {
    # 是否启用控制台输出
    "console_enabled": True,
    
    # 是否记录到日志文件
    "log_enabled": True,
    "log_file": "/root/.openclaw/workspace/stock_monitor.log",
    
    # Webhook通知（可选）
    # 支持钉钉、飞书、企业微信等
    "webhook_enabled": False,
    "webhook_url": "",
    "webhook_type": "dingtalk",  # dingtalk, feishu, wechat
}


def send_console_notification(alerts, portfolio_summary=None):
    """发送控制台通知"""
    if not alerts and not portfolio_summary:
        return
    
    print("\n" + "=" * 80)
    print(f"📊 股票价格监控报告 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    if portfolio_summary:
        print("\n【当前持仓概况】")
        for sector, stocks in portfolio_summary.items():
            print(f"\n  ▶ {sector}")
            for stock in stocks:
                status_icon = "🟢" if stock['price_status'] == 'normal' else "🔴" if stock['price_status'] == 'stop_loss' else "🟡"
                print(f"    {status_icon} {stock['name']}({stock['code']}): {stock['current_price']:.2f}")
                print(f"       买入:{stock['target_buy']:.2f} 止损:{stock['stop_loss']:.2f} 卖出:{stock['target_sell']:.2f}")
    
    if alerts:
        print("\n" + "⚠️" * 40)
        print("【价格提醒】")
        print("⚠️" * 40)
        
        for alert in alerts:
            emoji = {"买入提醒": "🟢", "止损提醒": "🔴", "卖出提醒": "🟡"}.get(alert['type'], "⚪")
            print(f"\n{emoji} {alert['type']} - {alert['name']}({alert['code']})")
            print(f"   板块: {alert['sector']}")
            print(f"   当前价格: {alert['price']:.2f}")
            print(f"   目标价格: {alert['target']:.2f}")
            print(f"   触发时间: {alert.get('time', datetime.now().strftime('%H:%M:%S'))}")
    else:
        print("\n✅ 今日无价格提醒")
    
    print("\n" + "=" * 80)


def send_log_notification(alerts, portfolio_summary=None):
    """记录到日志文件"""
    log_file = NOTIFICATION_CONFIG.get("log_file", "/root/.openclaw/workspace/stock_monitor.log")
    
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 股票监控检查\n")
        f.write("-" * 60 + "\n")
        
        if portfolio_summary:
            f.write("【持仓概况】\n")
            for sector, stocks in portfolio_summary.items():
                f.write(f"  {sector}:\n")
                for stock in stocks:
                    f.write(f"    {stock['name']}({stock['code']}): {stock['current_price']:.2f}\n")
        
        if alerts:
            f.write("【价格提醒】\n")
            for alert in alerts:
                f.write(f"  {alert['type']}: {alert['name']}({alert['code']}) - ")
                f.write(f"当前:{alert['price']:.2f} 目标:{alert['target']:.2f}\n")
        else:
            f.write("今日无价格提醒\n")
        
        f.write("=" * 60 + "\n\n")


def send_webhook_notification(alerts):
    """发送Webhook通知（钉钉/飞书/企业微信）"""
    if not NOTIFICATION_CONFIG.get("webhook_enabled") or not alerts:
        return
    
    webhook_url = NOTIFICATION_CONFIG.get("webhook_url")
    webhook_type = NOTIFICATION_CONFIG.get("webhook_type", "dingtalk")
    
    if not webhook_url:
        return
    
    try:
        import urllib.request
        import urllib.parse
        
        # 构建消息内容
        content = f"## 📊 股票价格提醒\n\n**时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        for alert in alerts:
            emoji = {"买入提醒": "🟢", "止损提醒": "🔴", "卖出提醒": "🟡"}.get(alert['type'], "⚪")
            content += f"### {emoji} {alert['type']}\n"
            content += f"- **股票**: {alert['name']}({alert['code']})\n"
            content += f"- **板块**: {alert['sector']}\n"
            content += f"- **当前价格**: {alert['price']:.2f}\n"
            content += f"- **目标价格**: {alert['target']:.2f}\n\n"
        
        # 根据不同平台构建请求
        if webhook_type == "dingtalk":
            # 钉钉机器人
            data = {
                "msgtype": "markdown",
                "markdown": {
                    "title": "股票价格提醒",
                    "text": content
                }
            }
        elif webhook_type == "feishu":
            # 飞书机器人
            data = {
                "msg_type": "interactive",
                "card": {
                    "config": {"wide_screen_mode": True},
                    "header": {
                        "title": {"tag": "plain_text", "content": "股票价格提醒"},
                        "template": "orange"
                    },
                    "elements": [{"tag": "div", "text": {"tag": "lark_md", "content": content}}]
                }
            }
        else:
            # 默认文本格式
            data = {"text": content}
        
        json_data = json.dumps(data).encode('utf-8')
        req = urllib.request.Request(
            webhook_url,
            data=json_data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = response.read().decode('utf-8')
            print(f"Webhook通知发送结果: {result}")
            
    except Exception as e:
        print(f"Webhook通知发送失败: {e}")


def send_notification(alerts, portfolio_summary=None):
    """发送所有通知"""
    if NOTIFICATION_CONFIG.get("console_enabled"):
        send_console_notification(alerts, portfolio_summary)
    
    if NOTIFICATION_CONFIG.get("log_enabled"):
        send_log_notification(alerts, portfolio_summary)
    
    if NOTIFICATION_CONFIG.get("webhook_enabled") and alerts:
        send_webhook_notification(alerts)


if __name__ == '__main____':
    # 测试通知功能
    test_alerts = [
        {
            'name': '测试股票',
            'code': '000001.SZ',
            'sector': '测试板块',
            'type': '买入提醒',
            'price': 10.5,
            'target': 11.0
        }
    ]
    send_notification(test_alerts)
