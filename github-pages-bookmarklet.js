// GitHub Pages 启用脚本
// 复制以下内容到浏览器控制台执行（在 GitHub 仓库页面）

javascript:(function(){
    // 检查是否在正确的页面
    if (!window.location.href.includes('github.com/Henjin888/hejin-music-platform')) {
        alert('请先访问 https://github.com/Henjin888/hejin-music-platform');
        return;
    }
    
    // 跳转到 Pages 设置页面
    window.location.href = 'https://github.com/Henjin888/hejin-music-platform/settings/pages';
})();
