// Vercel 自动化部署脚本
import { chromium } from 'playwright';

async function deploy() {
  console.log('启动浏览器...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // 打开 Vercel 导入页面
  console.log('打开 Vercel...');
  await page.goto('https://vercel.com/import/git/github/Henjin888/hejin-music-platform');
  
  console.log('请在浏览器中手动完成以下步骤：');
  console.log('1. 点击 Import Project');
  console.log('2. 配置环境变量');
  console.log('3. 点击 Deploy');
  console.log('');
  console.log('完成后告诉 我你的网站 URL');
  
  // 保持浏览器打开
  await page.waitForTimeout(300000);
  
  await browser.close();
}

deploy().catch(console.error);