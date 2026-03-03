/**
 * XMUSIC 共享功能模块
 * 包含货币切换、语言切换、移动端菜单等功能
 * 版本: 1.1.0
 */

// ========== 安全配置 ==========
// XSS防护：转义HTML特殊字符
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 输入验证：检查是否为有效数字
function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

// 输入验证：检查是否为有效字符串
function isValidString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

// ========== 货币切换功能 ==========
const CURRENCY_CONFIG = {
    USD: { symbol: '$', rate: 1, name: 'USD' },
    CNY: { symbol: '¥', rate: 7.2, name: 'CNY' },
    EUR: { symbol: '€', rate: 0.92, name: 'EUR' },
    GBP: { symbol: '£', rate: 0.79, name: 'GBP' },
    JPY: { symbol: '¥', rate: 150, name: 'JPY' },
    KRW: { symbol: '₩', rate: 1330, name: 'KRW' }
};

let currentCurrency = 'USD';

try {
    const storedCurrency = localStorage.getItem('xmusic-currency');
    if (storedCurrency && CURRENCY_CONFIG[storedCurrency]) {
        currentCurrency = storedCurrency;
    }
} catch (e) {
    console.warn('localStorage not available:', e);
}

/**
 * 格式化货币金额
 * @param {number} amount - 金额（USD基准）
 * @param {string} currency - 目标货币代码
 * @returns {string} 格式化后的货币字符串
 */
function formatCurrency(amount, currency = currentCurrency) {
    try {
        // 输入验证
        if (!isValidNumber(amount)) {
            console.warn('Invalid amount for formatCurrency:', amount);
            return '-'; // 返回安全默认值
        }
        
        const config = CURRENCY_CONFIG[currency];
        if (!config) {
            console.warn('Unknown currency:', currency);
            return amount.toString();
        }
        
        const converted = amount * config.rate;
        
        if (currency === 'JPY' || currency === 'KRW') {
            return `${config.symbol}${Math.round(converted).toLocaleString()}`;
        }
        
        return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    } catch (error) {
        console.error('Error in formatCurrency:', error);
        return '-';
    }
}

/**
 * 转换金额
 * @param {number} amount - 金额
 * @param {string} fromCurrency - 源货币
 * @param {string} toCurrency - 目标货币
 * @returns {number} 转换后的金额
 */
function convertAmount(amount, fromCurrency, toCurrency) {
    try {
        if (!isValidNumber(amount)) return 0;
        const fromRate = CURRENCY_CONFIG[fromCurrency]?.rate || 1;
        const toRate = CURRENCY_CONFIG[toCurrency]?.rate || 1;
        return (amount / fromRate) * toRate;
    } catch (error) {
        console.error('Error in convertAmount:', error);
        return 0;
    }
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

let currentLang = 'zh';

try {
    const storedLang = localStorage.getItem('xmusic-lang');
    if (storedLang && TRANSLATIONS[storedLang]) {
        currentLang = storedLang;
    }
} catch (e) {
    console.warn('localStorage not available:', e);
}

/**
 * 获取翻译文本
 * @param {string} key - 翻译键
 * @returns {string} 翻译后的文本
 */
function t(key) {
    try {
        const translations = TRANSLATIONS[currentLang] || TRANSLATIONS.zh;
        return translations[key] || TRANSLATIONS.zh[key] || key;
    } catch (error) {
        console.error('Error in t():', error);
        return key;
    }
}

/**
 * 应用翻译到页面元素
 */
function applyTranslations() {
    try {
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
    } catch (error) {
        console.error('Error in applyTranslations:', error);
    }
}

// ========== 移动端菜单 ==========
function initMobileMenu() {
    try {
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
    } catch (error) {
        console.error('Error in initMobileMenu:', error);
    }
}

// ========== 工具函数 ==========

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 安全地获取localStorage值
 * @param {string} key - 键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的值或默认值
 */
function safeGetStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (e) {
        console.warn('localStorage not available:', e);
        return defaultValue;
    }
}

/**
 * 安全地设置localStorage值
 * @param {string} key - 键名
 * @param {*} value - 值
 */
function safeSetStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.warn('localStorage not available:', e);
    }
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 应用当前货币显示
        const currencyDisplay = document.getElementById('currentCurrency');
        if (currencyDisplay) {
            currencyDisplay.textContent = currentCurrency;
        }
        
        // 应用翻译
        applyTranslations();
        
        // 初始化移动端菜单
        initMobileMenu();
        
        console.log('XMUSIC shared module initialized successfully');
    } catch (error) {
        console.error('Error initializing XMUSIC module:', error);
    }
});

// 导出函数供全局使用
window.XMUSIC = {
    formatCurrency,
    convertAmount,
    t,
    applyTranslations,
    CURRENCY_CONFIG,
    escapeHtml,
    isValidNumber,
    isValidString,
    debounce,
    throttle,
    safeGetStorage,
    safeSetStorage,
    getCurrentCurrency: () => currentCurrency,
    getCurrentLang: () => currentLang
};
