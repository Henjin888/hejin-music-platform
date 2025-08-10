# 音乐AI生成模块（Magenta集成）

本模块集成了 Google Magenta 项目作为 AI 音乐生成核心，支持在本地环境免费生成旋律（MIDI 文件），可用于音乐创作、教学和娱乐等场景。

## 依赖安装

建议在 Python 虚拟环境下安装依赖：

```bash
pip install -r requirements-music-ai.txt
```

## 基本用法

你可以在 `src/music_ai_generator/generate_melody.py` 中找到 `generate_melody` 方法。

**示例：**
```python
from music_ai_generator.generate_melody import generate_melody

generate_melody(output_path="output.mid", num_steps=128, temperature=1.0)
```
> 当前为结构示例，后续会补充具体 Magenta 调用流程和模型参数配置。

## 开发建议

- 按需完善 `generate_melody.py`，补充模型加载、音乐生成及MIDI文件保存功能。
- 可根据平台业务需求扩展风格、自定义输入、批量生成等功能。
- 推荐阅读 [Magenta官方文档](https://github.com/magenta/magenta) 获得更多实例和高级用法。

## 许可与费用

- 本模块及其所用 Magenta 项目遵循 Apache 2.0 开源协议，**免费使用**。
- 仅需为服务器算力或云存储等资源自行承担费用。

---

如有问题或遇到技术障碍，可在项目 issue 区留言，或查阅 Magenta 社区资料.