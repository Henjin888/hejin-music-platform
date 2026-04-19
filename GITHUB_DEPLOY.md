# VocalOS Vercel 部署配置

## 方案 1: Vercel Deploy Button

Copy this code to create a deploy button in your README:

```markdown
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/git/github/Henjin888/hejin-music-platform)
```

## 方案 2: GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 方案 3: 直接在 Vercel 导入

1. 打开：https://vercel.com/import/git/github/Henjin888/hejin-music-platform
2. 配置环境变量
3. Deploy

---

## 你需要做的

由于 Vercel 需要认证，最简单的方式是你手动点击导入页面。

我已经帮你打开了浏览器，直接点击 Import 就可以了！

URL: https://vercel.com/import/git/github/Henjin888/hejin-music-platform