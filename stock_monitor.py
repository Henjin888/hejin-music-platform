#!/usr/bin/env python3
"""
股票价格监控系统
监控AI算力、固态电池、人形机器人三大方向的6只标的
每天早上7:00检查股价，触及目标价位时发送通知
"""

import json
import os
import sys
from datetime import datetime

# 导入通知模块
try:
    from stock_notifier import send_notification
except ImportError:
    # 如果导入失败，定义一个默认的通知函数
    def send_notification(alerts, portfolio_summary=None):
        if not alerts:
            print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 没有触发任何价格提醒")
            return
        
        print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 发现 {len(alerts)} 条价格提醒：")
        print("=" * 60)
        
        for alert in alerts:
            print(alert['message'])
            print(f"   板块: {alert['sector']} | 当前价: {alert['price']} | 目标价: {alert['target']}")
            print("-" * 60)

# 股票配置数据
STOCKS = {
    # AI算力方向
    "寒武纪": {
        "code": "688256.SH",
        "sector": "AI算力",
        "current_price": 1100.00,  # 当前价（参考值）
        "target_buy": 950.00,      # 目标买入价
        "stop_loss": 850.00,       # 止损价
        "target_sell": 1300.00     # 目标卖出价
    },
    "澜起科技": {
        "code": "688008.SH",
        "sector": "AI算力",
        "current_price": 165.00,   # 当前价（参考值）
        "target_buy": 140.00,      # 目标买入价
        "stop_loss": 120.00,       # 止损价
        "target_sell": 200.00      # 目标卖出价
    },
    # 固态电池方向
    "宁德时代": {
        "code": "300750.SZ",
        "sector": "固态电池",
        "current_price": 365.00,   # 当前价（参考值）
        "target_buy": 320.00,      # 目标买入价
        "stop_loss": 280.00,       # 止损价
        "target_sell": 450.00      # 目标卖出价
    },
    "先导智能": {
        "code": "300450.SZ",
        "sector": "固态电池",
        "current_price": 55.00,    # 当前价（参考值）
        "target_buy": 45.00,       # 目标买入价
        "stop_loss": 38.00,        # 止损价
        "target_sell": 70.00       # 目标卖出价
    },
    # 人形机器人方向
    "拓普集团": {
        "code": "601689.SH",
        "sector": "人形机器人",
        "current_price": 69.00,    # 当前价（参考值）
        "target_buy": 58.00,       # 目标买入价
        "stop_loss": 50.00,        # 止损价
        "target_sell": 85.00       # 目标卖出价
    },
    "三花智控": {
        "code": "002050.SZ",
        "sector": "人形机器人",
        "current_price": 52.00,    # 当前价（参考值）
        "target_buy": 45.00,       # 目标买入价
        "stop_loss": 38.00,        # 止损价
        "target_sell": 65.00       # 目标卖出价
    }
}

# 配置文件路径
CONFIG_FILE = os.path.expanduser("~/.stock_monitor_config.json")
ALERT_STATE_FILE = os.path.expanduser("~/.stock_alert_state.json")


def load_config():
    """加载配置文件"""
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return STOCKS


def save_config(config):
    """保存配置文件"""
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)


def load_alert_state():
    """加载提醒状态（避免重复提醒）"""
    if os.path.exists(ALERT_STATE_FILE):
        with open(ALERT_STATE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def save_alert_state(state):
    """保存提醒状态"""
    with open(ALERT_STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def get_stock_price(stock_code):
    """
    获取股票实时价格
    支持多种数据源：腾讯财经、新浪财经、东方财富
    """
    import urllib.request
    import re
    
    # 转换代码格式
    if stock_code.endswith('.SH'):
        code = stock_code.replace('.SH', '')
        tencent_code = 'sh' + code
    elif stock_code.endswith('.SZ'):
        code = stock_code.replace('.SZ', '')
        tencent_code = 'sz' + code
    else:
        code = stock_code
        tencent_code = code
    
    # 尝试腾讯财经API
    try:
        url = f"https://qt.gtimg.cn/q={tencent_code}"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read().decode('gbk')
        
        # 解析腾讯数据格式: v_sh688256="1~寒武纪-U~688256~1100.00~..."
        match = re.search(r'"([^"]*)"', data)
        if match:
            parts = match.group(1).split('~')
            if len(parts) >= 4:
                price = float(parts[3])
                if price > 0:
                    return price
    except Exception as e:
        pass
    
    # 尝试新浪财经API
    try:
        url = f"https://hq.sinajs.cn/list={tencent_code}"
        req = urllib.request.Request(url, headers={
            'Referer': 'https://finance.sina.com.cn',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read().decode('gbk')
        
        match = re.search(r'"([^"]*)"', data)
        if match:
            parts = match.group(1).split(',')
            if len(parts) >= 3:
                price = float(parts[3])
                if price > 0:
                    return price
    except Exception as e:
        pass
    
    # 尝试东方财富API
    try:
        url = f"https://push2.eastmoney.com/api/qt/stock/get?secid={('1.' if stock_code.endswith('.SH') else '0.')}{code}&fields=f43"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read().decode('utf-8')
        
        # 解析JSON数据
        import json
        json_data = json.loads(data)
        if 'data' in json_data and json_data['data']:
            # f43字段是价格（需要除以100）
            price_raw = json_data['data'].get('f43')
            if price_raw:
                return float(price_raw) / 100
    except Exception as e:
        pass
    
    print(f"获取股价失败 {stock_code}: 所有API均不可用")
    return None


def check_prices():
    """检查所有股票价格"""
    config = load_config()
    alert_state = load_alert_state()
    today = datetime.now().strftime('%Y-%m-%d')
    
    alerts = []
    portfolio_summary = {}
    
    for name, info in config.items():
        code = info['code']
        sector = info['sector']
        
        # 获取实时价格
        current_price = get_stock_price(code)
        
        if current_price is None:
            # 如果获取失败，使用配置中的参考价格
            current_price = info.get('current_price', 0)
            print(f"[{name}] 使用参考价格: {current_price}")
        else:
            # 更新配置中的价格
            info['current_price'] = current_price
            print(f"[{name}] 实时价格: {current_price}")
        
        # 确定价格状态
        if current_price <= info['stop_loss']:
            price_status = 'stop_loss'
        elif current_price >= info['target_sell']:
            price_status = 'target_sell'
        elif current_price <= info['target_buy']:
            price_status = 'target_buy'
        else:
            price_status = 'normal'
        
        # 添加到组合摘要
        if sector not in portfolio_summary:
            portfolio_summary[sector] = []
        portfolio_summary[sector].append({
            'name': name,
            'code': code,
            'current_price': current_price,
            'target_buy': info['target_buy'],
            'stop_loss': info['stop_loss'],
            'target_sell': info['target_sell'],
            'price_status': price_status
        })
        
        # 检查是否触及目标价位
        alert_key = f"{name}_{today}"
        
        # 检查买入提醒
        if current_price <= info['target_buy']:
            if alert_state.get(f"{alert_key}_buy") != True:
                alerts.append({
                    'name': name,
                    'code': code,
                    'sector': sector,
                    'type': '买入提醒',
                    'price': current_price,
                    'target': info['target_buy'],
                    'message': f"🟢 【买入提醒】{name}({code}) 当前价 {current_price} 已触及目标买入价 {info['target_buy']}",
                    'time': datetime.now().strftime('%H:%M:%S')
                })
                alert_state[f"{alert_key}_buy"] = True
        
        # 检查止损提醒
        if current_price <= info['stop_loss']:
            if alert_state.get(f"{alert_key}_stop") != True:
                alerts.append({
                    'name': name,
                    'code': code,
                    'sector': sector,
                    'type': '止损提醒',
                    'price': current_price,
                    'target': info['stop_loss'],
                    'message': f"🔴 【止损提醒】{name}({code}) 当前价 {current_price} 已触及止损价 {info['stop_loss']}",
                    'time': datetime.now().strftime('%H:%M:%S')
                })
                alert_state[f"{alert_key}_stop"] = True
        
        # 检查卖出提醒
        if current_price >= info['target_sell']:
            if alert_state.get(f"{alert_key}_sell") != True:
                alerts.append({
                    'name': name,
                    'code': code,
                    'sector': sector,
                    'type': '卖出提醒',
                    'price': current_price,
                    'target': info['target_sell'],
                    'message': f"🟡 【卖出提醒】{name}({code}) 当前价 {current_price} 已触及目标卖出价 {info['target_sell']}",
                    'time': datetime.now().strftime('%H:%M:%S')
                })
                alert_state[f"{alert_key}_sell"] = True
    
    # 保存配置和状态
    save_config(config)
    save_alert_state(alert_state)
    
    return alerts, portfolio_summary


def show_portfolio():
    """显示投资组合"""
    config = load_config()
    
    print("\n" + "=" * 80)
    print("股票价格监控系统 - 投资组合")
    print("=" * 80)
    
    current_sector = None
    for name, info in config.items():
        if info['sector'] != current_sector:
            current_sector = info['sector']
            print(f"\n【{current_sector}】")
            print("-" * 80)
        
        print(f"  名称: {name}")
        print(f"  代码: {info['code']}")
        print(f"  当前价: {info['current_price']:.2f}")
        print(f"  目标买入价: {info['target_buy']:.2f}")
        print(f"  止损价: {info['stop_loss']:.2f}")
        print(f"  目标卖出价: {info['target_sell']:.2f}")
        print()


def update_price(stock_name, new_price):
    """手动更新股票价格"""
    config = load_config()
    
    if stock_name not in config:
        print(f"错误: 未找到股票 '{stock_name}'")
        print(f"可用股票: {', '.join(config.keys())}")
        return False
    
    config[stock_name]['current_price'] = float(new_price)
    save_config(config)
    print(f"已更新 {stock_name} 的价格为 {new_price}")
    return True


def update_target(stock_name, target_type, new_value):
    """更新目标价格"""
    config = load_config()
    
    if stock_name not in config:
        print(f"错误: 未找到股票 '{stock_name}'")
        return False
    
    valid_types = ['target_buy', 'stop_loss', 'target_sell']
    if target_type not in valid_types:
        print(f"错误: 无效的目标类型 '{target_type}'")
        print(f"可用类型: {', '.join(valid_types)}")
        return False
    
    config[stock_name][target_type] = float(new_value)
    save_config(config)
    
    type_names = {
        'target_buy': '目标买入价',
        'stop_loss': '止损价',
        'target_sell': '目标卖出价'
    }
    print(f"已更新 {stock_name} 的{type_names[target_type]}为 {new_value}")
    return True


def main():
    """主函数"""
    if len(sys.argv) < 2:
        # 默认执行价格检查
        alerts, portfolio_summary = check_prices()
        send_notification(alerts, portfolio_summary)
        return
    
    command = sys.argv[1]
    
    if command == 'show':
        # 显示投资组合
        show_portfolio()
    
    elif command == 'check':
        # 检查价格
        alerts, portfolio_summary = check_prices()
        send_notification(alerts, portfolio_summary)
    
    elif command == 'update':
        # 更新价格: python stock_monitor.py update 寒武纪 1150
        if len(sys.argv) < 4:
            print("用法: python stock_monitor.py update <股票名称> <新价格>")
            return
        update_price(sys.argv[2], sys.argv[3])
    
    elif command == 'target':
        # 更新目标价: python stock_monitor.py target 寒武纪 target_buy 900
        if len(sys.argv) < 5:
            print("用法: python stock_monitor.py target <股票名称> <target_buy|stop_loss|target_sell> <新价格>")
            return
        update_target(sys.argv[2], sys.argv[3], sys.argv[4])
    
    elif command == 'reset':
        # 重置提醒状态
        if os.path.exists(ALERT_STATE_FILE):
            os.remove(ALERT_STATE_FILE)
            print("已重置提醒状态")
        else:
            print("提醒状态文件不存在")
    
    elif command == 'init':
        # 初始化配置
        save_config(STOCKS)
        print("已初始化股票配置")
        show_portfolio()
    
    else:
        print(f"未知命令: {command}")
        print("可用命令:")
        print("  check       - 检查股价并发送提醒")
        print("  show        - 显示投资组合")
        print("  update      - 更新股票价格")
        print("  target      - 更新目标价格")
        print("  reset       - 重置提醒状态")
        print("  init        - 初始化配置")


if __name__ == '__main__':
    main()
