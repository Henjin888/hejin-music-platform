#!/usr/bin/env python3
"""
小红书自动发布脚本 - 好莱坞音乐经纪人赫金专用
使用说明：
1. 先手动登录小红书，导出 cookie 填入下方 COOKIES 变量
2. 准备图片放入 images/ 文件夹
3. 运行脚本：python3 xiaohongshu_poster.py
"""

import json
import time
import random
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# ==================== 配置区域 ====================

# 你的小红书 Cookie（登录后从浏览器开发者工具复制）
COOKIES = [
    # 示例格式，请替换为你的真实 cookie
    # {"name": "webId", "value": "xxx", "domain": ".xiaohongshu.com", "path": "/"},
    # {"name": "xhsTracker", "value": "xxx", "domain": ".xiaohongshu.com", "path": "/"},
]

# 发布内容配置
POST_CONFIG = {
    "title": "在好莱坞做了8年音乐经纪人，说点得罪人的大实话",
    "content": """在好莱坞做了8年音乐经纪人，说点得罪人的大实话

很多人以为好莱坞音乐圈光鲜亮丽
实际上90%的音乐人都在为房租发愁

我见过太多有才华的歌手
因为不懂规则，被合同坑到倾家荡产
也见过太多"关系户"
靠资源上位，作品却一文不值

这就是为什么我要做这件事——
重新制定公平的音乐人合作规则

不看出身，只看作品
不论资排辈，只论才华

如果你是有实力的音乐制作人/歌手
欢迎投稿📮 xiao2240275008@gmail.com
让我们一起，做些不凡的金曲""",
    "tags": ["好莱坞音乐", "音乐制作人", "独立音乐人", "音乐合作", "音乐人招募", "洛杉矶音乐"],
    "image_folder": "./images/post1/",  # 图片文件夹路径
}

# ==================== 核心功能 ====================

class XiaohongshuPoster:
    def __init__(self, cookies, headless=False):
        self.cookies = cookies
        self.headless = headless
        self.browser = None
        self.context = None
        self.page = None
    
    def start(self):
        """启动浏览器"""
        playwright = sync_playwright().start()
        self.browser = playwright.chromium.launch(
            headless=self.headless,
            args=['--disable-blink-features=AutomationControlled']
        )
        self.context = self.browser.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        )
        
        # 注入 cookie
        if self.cookies:
            self.context.add_cookies(self.cookies)
        
        self.page = self.context.new_page()
        print("✅ 浏览器启动成功")
    
    def login_check(self):
        """检查登录状态"""
        self.page.goto("https://www.xiaohongshu.com")
        time.sleep(3)
        
        # 检查是否已登录（看是否有个人头像）
        try:
            self.page.wait_for_selector('[data-testid="avatar"]', timeout=5000)
            print("✅ 登录状态正常")
            return True
        except PlaywrightTimeout:
            print("❌ 未登录，请先手动登录并导出 cookie")
            return False
    
    def create_post(self, config):
        """创建发布"""
        print(f"\n📝 开始发布: {config['title'][:30]}...")
        
        # 1. 打开发布页面
        self.page.goto("https://creator.xiaohongshu.com/publish/publish")
        time.sleep(2)
        
        # 2. 上传图片
        image_files = list(Path(config['image_folder']).glob("*.jpg")) + \
                     list(Path(config['image_folder']).glob("*.png"))
        
        if not image_files:
            print(f"❌ 未找到图片: {config['image_folder']}")
            return False
        
        print(f"📸 找到 {len(image_files)} 张图片")
        
        # 点击上传按钮
        upload_input = self.page.locator('input[type="file"]').first
        upload_input.set_input_files([str(f) for f in image_files[:9]])  # 最多9张
        time.sleep(3)
        
        # 3. 填写标题
        title_input = self.page.locator('input[placeholder*="标题"]').first
        title_input.fill(config['title'])
        time.sleep(0.5)
        
        # 4. 填写正文
        content_input = self.page.locator('div[contenteditable="true"]').first
        content_input.fill(config['content'])
        time.sleep(0.5)
        
        # 5. 添加话题标签
        for tag in config['tags']:
            # 在正文末尾添加标签
            content_input.press('End')
            content_input.type(f" #{tag}")
            time.sleep(0.3)
        
        print("✅ 内容填写完成")
        
        # 6. 模拟真人操作延迟
        time.sleep(random.uniform(2, 4))
        
        # 7. 点击发布（注释掉，测试时先不真发）
        # publish_btn = self.page.locator('button:has-text("发布")').first
        # publish_btn.click()
        # print("🚀 已点击发布")
        
        print("⏸️  发布按钮已定位，请手动确认后发布（或取消注释自动发布代码）")
        
        # 等待用户查看
        time.sleep(10)
        return True
    
    def close(self):
        """关闭浏览器"""
        if self.browser:
            self.browser.close()
            print("✅ 浏览器已关闭")


def export_cookies_guide():
    """导出 cookie 的教程"""
    guide = """
📖 Cookie 导出教程：

方法1：Chrome 开发者工具
1. 打开 Chrome，登录小红书网页版
2. 按 F12 打开开发者工具 → Application/应用 → Cookies
3. 找到 xiaohongshu.com 的 cookie，复制 name 和 value

方法2：使用 EditThisCookie 插件
1. 安装 EditThisCookie 浏览器插件
2. 登录小红书后，点击插件图标
3. 导出为 JSON 格式，复制内容填入脚本

方法3：我远程帮你操作
1. 开启屏幕共享
2. 我指导你一步步导出
"""
    print(guide)


def main():
    """主函数"""
    print("=" * 50)
    print("🎵 小红书自动发布工具 - 好莱坞音乐经纪人专用")
    print("=" * 50)
    
    # 检查 cookie 是否已配置
    if not COOKIES or COOKIES[0].get('value') == 'xxx':
        print("\n⚠️  请先配置你的小红书 Cookie！")
        export_cookies_guide()
        return
    
    # 创建发布器实例
    poster = XiaohongshuPoster(COOKIES, headless=False)
    
    try:
        # 启动浏览器
        poster.start()
        
        # 检查登录状态
        if not poster.login_check():
            print("\n请先登录小红书并导出 Cookie")
            return
        
        # 执行发布
        poster.create_post(POST_CONFIG)
        
    except Exception as e:
        print(f"\n❌ 出错: {e}")
    finally:
        poster.close()


if __name__ == "__main__":
    main()
