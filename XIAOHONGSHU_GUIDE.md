# 小红书自动发布系统 - 使用指南

## 📁 文件说明

| 文件 | 用途 |
|------|------|
| `xiaohongshu_poster.py` | 主发布脚本 |
| `xiaohongshu_cron.sh` | 定时任务脚本 |
| `xiaohongshu_content.yaml` | 内容模板库（5篇爆款文案） |

---

## 🚀 快速开始

### 第一步：安装依赖

```bash
# 安装 Python 依赖
pip install playwright pyyaml

# 安装浏览器
playwright install chromium
```

### 第二步：获取小红书 Cookie

**方法：Chrome 开发者工具**

1. 打开 Chrome，访问 https://www.xiaohongshu.com
2. 扫码或手机号登录你的账号
3. 按 `F12` 打开开发者工具
4. 点击 `Application/应用` → `Cookies` → `https://www.xiaohongshu.com`
5. 找到以下关键 cookie，复制 name 和 value：
   - `webId`
   - `xhsTracker`
   - `xhsTrackerId`
   - `xhs_user_id`
   - `xhs_token`

6. 填入 `xiaohongshu_poster.py` 的 `COOKIES` 变量：

```python
COOKIES = [
    {"name": "webId", "value": "你的值", "domain": ".xiaohongshu.com", "path": "/"},
    {"name": "xhsTracker", "value": "你的值", "domain": ".xiaohongshu.com", "path": "/"},
    # ... 其他 cookie
]
```

### 第三步：准备图片

```bash
# 创建图片目录
mkdir -p images/post1
mkdir -p images/post2
# ... 更多目录

# 把生成的图片放入对应目录
# 每篇贴文放 2-9 张图片
```

### 第四步：测试运行

```bash
# 先测试（不会真发布，只填写内容）
python3 xiaohongshu_poster.py

# 看到"内容填写完成"后，手动检查浏览器中的内容
# 确认无误后，取消脚本中的发布注释，再次运行
```

---

## ⏰ 设置定时发布

### 方法：Crontab

```bash
# 编辑定时任务
crontab -e

# 添加以下行（每天 10:00 和 20:00 发布）
0 10,20 * * * /root/.openclaw/workspace/xiaohongshu_cron.sh

# 保存退出
```

### 查看定时任务

```bash
# 列出所有定时任务
crontab -l

# 查看执行日志
tail -f logs/xiaohongshu_20250228.log
```

---

## 📝 内容模板

已预置 5 篇爆款文案在 `xiaohongshu_content.yaml`：

| 编号 | 类型 | 标题 |
|------|------|------|
| post_001 | 揭秘向 | 在好莱坞做了8年音乐经纪人，说点得罪人的大实话 |
| post_002 | 干货向 | 好莱坞音乐人的一天｜凌晨4点的录音棚 |
| post_003 | 招募向 | 🎵 招募音乐制作人｜好莱坞金曲团队等你加入 |
| post_004 | 故事向 | 那个在洛杉矶地下室写歌的女孩，现在怎么样了 |
| post_005 | 观点向 | 为什么90%的音乐人赚不到钱｜行业真相 |

---

## 🎨 生成配图

### 使用 Midjourney

复制 `xiaohongshu_content.yaml` 中的 `image_prompts` 到 Midjourney

### 使用即梦/可灵（国内）

把英文提示词翻译成中文使用

### 使用我帮你生成

如果你提供 AI 绘图工具的 API，我可以直接调用生成图片

---

## ⚠️ 注意事项

1. **Cookie 有效期**：小红书 cookie 会过期，需要定期更新
2. **发布频率**：建议每天 1-2 篇，避免被限流
3. **图片版权**：使用 AI 生成或自有版权图片
4. **内容合规**：避免敏感词，遵守平台规则

---

## 🔧 故障排查

### 问题：提示"未登录"
- 检查 cookie 是否正确复制
- 确认 cookie 未过期（重新登录获取）

### 问题：无法上传图片
- 检查图片路径是否正确
- 确认图片格式为 jpg/png

### 问题：发布按钮找不到
- 小红书页面结构可能更新，需要调整选择器
- 联系我更新脚本

---

## 📞 需要帮助？

1. 获取 cookie 遇到困难 → 开启屏幕共享，我指导你
2. 需要更多文案模板 → 告诉我，我继续写
3. 脚本运行出错 → 把错误信息发给我

---

*创建时间：2026-02-28*
*版本：v1.0*
