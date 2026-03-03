/**
 * XMUSIC 共享功能模块
 * 包含货币切换、语言切换、移动端菜单等功能
 */

// ========== 货币切换功能 ==========
const CURRENCY_CONFIG = {
    USD: { symbol: '$', rate: 1, name: 'USD' },
    CNY: { symbol: '¥', rate: 7.2, name: 'CNY' },
    EUR: { symbol: '€', rate: 0.92, name: 'EUR' },
    GBP: { symbol: '£', rate: 0.79, name: 'GBP' },
    JPY: { symbol: '¥', rate: 150, name: 'JPY' },
    KRW: { symbol: '₩', rate: 1330, name: 'KRW' }
};

let currentCurrency = localStorage.getItem('xmusic-currency') || 'USD';

function formatCurrency(amount, currency = currentCurrency) {
    const config = CURRENCY_CONFIG[currency];
    if (!config) return amount;
    
    const converted = amount * config.rate;
    
    if (currency === 'JPY' || currency === 'KRW') {
        return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    
    return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function convertAmount(amount, fromCurrency, toCurrency) {
    const fromRate = CURRENCY_CONFIG[fromCurrency]?.rate || 1;
    const toRate = CURRENCY_CONFIG[toCurrency]?.rate || 1;
    return (amount / fromRate) * toRate;
}

// ========== 语言切换功能 ==========
const TRANSLATIONS = {
    zh: {
        home: '首页',
        discover: '发现',
        nearby: '附近音乐人',
        investments: '我的投资',
        create: '发起融资',
        login: '登录',
        connectWallet: '连接钱包',
        search: '搜索音乐人、项目...',
        startExploring: '开始探索',
        popularArtists: '热门音乐人',
        viewAll: '查看全部',
        invested: '已投资',
        target: '目标金额',
        daysLeft: '剩余天数',
        investNow: '立即投资',
        projectIntro: '项目介绍',
        shareAllocation: '份额分配',
        timeline: '时间线',
        investors: '投资人',
        cancel: '取消',
        confirm: '确认',
        amount: '金额',
        minInvest: '最低投资',
        expectedReturn: '预期回报',
        platformFee: '平台手续费'
    },
    en: {
        home: 'Home',
        discover: 'Discover',
        nearby: 'Nearby Artists',
        investments: 'My Investments',
        create: 'Start Funding',
        login: 'Login',
        connectWallet: 'Connect Wallet',
        search: 'Search artists, projects...',
        startExploring: 'Start Exploring',
        popularArtists: 'Popular Artists',
        viewAll: 'View All',
        invested: 'Invested',
        target: 'Target',
        daysLeft: 'Days Left',
        investNow: 'Invest Now',
        projectIntro: 'Project Introduction',
        shareAllocation: 'Share Allocation',
        timeline: 'Timeline',
        investors: 'Investors',
        cancel: 'Cancel',
        confirm: 'Confirm',
        amount: 'Amount',
        minInvest: 'Min Investment',
        expectedReturn: 'Expected Return',
        platformFee: 'Platform Fee'
    },
    zht: {
        home: '首頁',
        discover: '發現',
        nearby: '附近音樂人',
        investments: '我的投資',
        create: '發起融資',
        login: '登錄',
        connectWallet: '連接錢包',
        search: '搜尋音樂人、項目...',
        startExploring: '開始探索',
        popularArtists: '熱門音樂人',
        viewAll: '查看全部',
        invested: '已投資',
        target: '目標金額',
        daysLeft: '剩餘天數',
        investNow: '立即投資',
        projectIntro: '項目介紹',
        shareAllocation: '份額分配',
        timeline: '時間線',
        investors: '投資人',
        cancel: '取消',
        confirm: '確認',
        amount: '金額',
        minInvest: '最低投資',
        expectedReturn: '預期回報',
        platformFee: '平台手續費'
    },
    ja: {
        home: 'ホーム',
        discover: '発見',
        nearby: '近くのアーティスト',
        investments: 'マイ投資',
        create: '資金調達',
        login: 'ログイン',
        connectWallet: 'ウォレット接続',
        search: 'アーティスト、プロジェクトを検索...',
        startExploring: '探索を開始',
        popularArtists: '人気アーティスト',
        viewAll: 'すべて表示',
        invested: '投資済み',
        target: '目標金額',
        daysLeft: '残り日数',
        investNow: '今すぐ投資',
        projectIntro: 'プロジェクト紹介',
        shareAllocation: 'シェア配分',
        timeline: 'タイムライン',
        investors: '投資家',
        cancel: 'キャンセル',
        confirm: '確認',
        amount: '金額',
        minInvest: '最低投資額',
        expectedReturn: '期待収益率',
        platformFee: 'プラットフォーム手数料'
    },
    ko: {
        home: '홈',
        discover: '발견',
        nearby: '주변 아티스트',
        investments: '내 투자',
        create: '펀딩 시작',
        login: '로그인',
        connectWallet: '지갑 연결',
        search: '아티스트, 프로젝트 검색...',
        startExploring: '탐색 시작',
        popularArtists: '인기 아티스트',
        viewAll: '전첳 보기',
        invested: '투자됨',
        target: '목표 금액',
        daysLeft: '남은 일수',
        investNow: '지금 투자',
        projectIntro: '프로젝트 소개',
        shareAllocation: '지분 배분',
        timeline: '타임라인',
        investors: '투자자',
        cancel: '취소',
        confirm: '확인',
        amount: '금액',
        minInvest: '최소 투자',
        expectedReturn: '예상 수익률',
        platformFee: '플랫폼 수수료'
    }
};

let currentLang = localStorage.getItem('xmusic-lang') || 'zh';

function t(key) {
    const translations = TRANSLATIONS[currentLang] || TRANSLATIONS.zh;
    return translations[key] || TRANSLATIONS.zh[key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            el.textContent = t(key);
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
            el.placeholder = t(key);
        }
    });
}

// ========== 移动端菜单 ==========
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('fixed');
            sidebar.classList.toggle('inset-0');
            sidebar.classList.toggle('z-50');
        });
    }
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    // 应用当前货币显示
    const currencyDisplay = document.getElementById('currentCurrency');
    if (currencyDisplay) {
        currencyDisplay.textContent = currentCurrency;
    }
    
    // 应用翻译
    applyTranslations();
    
    // 初始化移动端菜单
    initMobileMenu();
});

// 导出函数供全局使用
window.XMUSIC = {
    formatCurrency,
    convertAmount,
    t,
    applyTranslations,
    CURRENCY_CONFIG,
    getCurrentCurrency: () => currentCurrency,
    getCurrentLang: () => currentLang
};
