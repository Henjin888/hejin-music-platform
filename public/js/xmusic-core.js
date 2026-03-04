// XMUSIC Core Module - 核心功能模块
// 包含：多语言、货币、Web3钱包、用户系统、投资系统

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        version: '2.0.0',
        apiBase: 'https://api.xmusic.finance',
        defaultLang: 'zh',
        defaultCurrency: 'USD',
        currencies: {
            USD: { symbol: '$', rate: 1, name: 'US Dollar' },
            CNY: { symbol: '¥', rate: 7.2, name: 'Chinese Yuan' },
            EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
            GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
            JPY: { symbol: '¥', rate: 150, name: 'Japanese Yen' },
            KRW: { symbol: '₩', rate: 1330, name: 'Korean Won' }
        },
        languages: ['zh', 'zht', 'en', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru']
    };

    // ==================== 翻译数据 ====================
    const TRANSLATIONS = {
        zh: {
            // 通用
            home: '首页', discover: '发现', nearby: '附近音乐人', invest: '我的投资',
            create: '发起融资', login: '登录', register: '注册', logout: '退出',
            profile: '个人中心', settings: '设置', favorites: '收藏', messages: '消息',
            search: '搜索', cancel: '取消', confirm: '确认', save: '保存',
            edit: '编辑', delete: '删除', close: '关闭', back: '返回',
            
            // 首页
            heroTitle: '发现下一个音乐巨星',
            heroSubtitle: 'XMUSIC — 连接音乐人与投资者的桥梁',
            explore: '探索', statsArtists: '活跃艺人', statsFunding: '总融资额',
            statsCommunity: '投资社区', statsSuccess: '成功率',
            featuredProjects: '精选项目', viewAll: '查看全部',
            howItWorks: '如何运作', step1Title: '发现艺人',
            step1Desc: '浏览平台上的独立音乐人及其融资项目',
            step2Title: '进行投资', step2Desc: '选择心仪项目，投资获得股份和收益分配权',
            step3Title: '分享成功', step3Desc: '随着艺人成长，分享他们的流媒体和销售收入',
            readyToStart: '准备好开始了吗？',
            joinCommunity: '加入数千名投资者，支持您喜爱的独立音乐人',
            startExploring: '开始探索', createAccount: '注册账户',
            
            // 投资
            investNow: '立即投资', investmentTiers: '投资等级',
            supporter: '支持者', fan: '粉丝', collector: '收藏家', producer: '制作人',
            minInvest: '最低投资', teamRoles: '团队角色',
            operations: '运营团队', investor: '投资人', agent: '经纪人',
            promoter: '星推官', fanRole: '粉丝',
            revenueShare: '收益分成', 
            
            // 钱包
            connectWallet: '连接钱包', disconnect: '断开连接',
            walletAddress: '钱包地址', copyAddress: '复制地址',
            installMetaMask: '安装 MetaMask', switchNetwork: '切换网络',
            
            // 货币
            selectCurrency: '选择货币',
            
            // 语言
            selectLanguage: '选择语言'
        },
        en: {
            home: 'Home', discover: 'Discover', nearby: 'Nearby Artists', invest: 'My Investments',
            create: 'Start Funding', login: 'Login', register: 'Register', logout: 'Logout',
            profile: 'Profile', settings: 'Settings', favorites: 'Favorites', messages: 'Messages',
            search: 'Search', cancel: 'Cancel', confirm: 'Confirm', save: 'Save',
            edit: 'Edit', delete: 'Delete', close: 'Close', back: 'Back',
            
            heroTitle: 'Discover the Next Music Star',
            heroSubtitle: 'XMUSIC — Bridging Musicians and Investors',
            explore: 'Explore', statsArtists: 'Active Artists', statsFunding: 'Total Funding',
            statsCommunity: 'Investor Community', statsSuccess: 'Success Rate',
            featuredProjects: 'Featured Projects', viewAll: 'View All',
            howItWorks: 'How It Works', step1Title: 'Discover Artists',
            step1Desc: 'Browse independent musicians and their funding projects',
            step2Title: 'Invest', step2Desc: 'Choose projects and invest for equity and revenue share',
            step3Title: 'Share Success', step3Desc: 'Share streaming and sales revenue as artists grow',
            readyToStart: 'Ready to Start?',
            joinCommunity: 'Join thousands of investors supporting independent musicians',
            startExploring: 'Start Exploring', createAccount: 'Create Account',
            
            investNow: 'Invest Now', investmentTiers: 'Investment Tiers',
            supporter: 'Supporter', fan: 'Fan', collector: 'Collector', producer: 'Producer',
            minInvest: 'Min Investment', teamRoles: 'Team Roles',
            operations: 'Operations', investor: 'Investor', agent: 'Agent',
            promoter: 'Promoter', fanRole: 'Fan',
            revenueShare: 'Revenue Share',
            
            connectWallet: 'Connect Wallet', disconnect: 'Disconnect',
            walletAddress: 'Wallet Address', copyAddress: 'Copy Address',
            installMetaMask: 'Install MetaMask', switchNetwork: 'Switch Network',
            
            selectCurrency: 'Select Currency',
            selectLanguage: 'Select Language'
        },
        ja: {
            home: 'ホーム', discover: '発見', nearby: '近くのアーティスト', invest: 'マイ投資',
            create: '資金調達開始', login: 'ログイン', register: '登録', logout: 'ログアウト',
            profile: 'プロフィール', settings: '設定', favorites: 'お気に入り', messages: 'メッセージ',
            search: '検索', cancel: 'キャンセル', confirm: '確認', save: '保存',
            heroTitle: '次の音楽スターを発見', heroSubtitle: 'XMUSIC — アーティストと投資家を繋ぐ',
            explore: '探索', featuredProjects: 'おすすめプロジェクト', viewAll: 'すべて見る'
        },
        ko: {
            home: '홈', discover: '발견', nearby: '주변 아티스트', invest: '내 투자',
            create: '펀딩 시작', login: '로그인', register: '회원가입', logout: '로그아웃',
            profile: '프로필', settings: '설정', favorites: '즐겨찾기', messages: '메시지',
            search: '검색', cancel: '취소', confirm: '확인', save: '저장',
            heroTitle: '다음 음악 스타 발견', heroSubtitle: 'XMUSIC — 아티스트와 투자자를 연결',
            explore: '탐색', featuredProjects: '추천 프로젝트', viewAll: '모두 보기'
        },
        es: {
            home: 'Inicio', discover: 'Descubrir', nearby: 'Artistas Cercanos', invest: 'Mis Inversiones',
            create: 'Iniciar Financiamiento', login: 'Iniciar Sesión', register: 'Registrarse', logout: 'Cerrar Sesión',
            profile: 'Perfil', settings: 'Configuración', favorites: 'Favoritos', messages: 'Mensajes',
            search: 'Buscar', cancel: 'Cancelar', confirm: 'Confirmar', save: 'Guardar',
            heroTitle: 'Descubre la Próxima Estrella Musical', heroSubtitle: 'XMUSIC — Conectando Músicos e Inversores',
            explore: 'Explorar', featuredProjects: 'Proyectos Destacados', viewAll: 'Ver Todo'
        },
        fr: {
            home: 'Accueil', discover: 'Découvrir', nearby: 'Artistes Proches', invest: 'Mes Investissements',
            create: 'Lancer le Financement', login: 'Connexion', register: 'Inscription', logout: 'Déconnexion',
            profile: 'Profil', settings: 'Paramètres', favorites: 'Favoris', messages: 'Messages',
            search: 'Rechercher', cancel: 'Annuler', confirm: 'Confirmer', save: 'Enregistrer',
            heroTitle: 'Découvrez la Prochaine Star', heroSubtitle: 'XMUSIC — Connecter Musiciens et Investisseurs',
            explore: 'Explorer', featuredProjects: 'Projets en Vedette', viewAll: 'Voir Tout'
        },
        de: {
            home: 'Startseite', discover: 'Entdecken', nearby: 'Künstler in der Nähe', invest: 'Meine Investitionen',
            create: 'Finanzierung Starten', login: 'Anmelden', register: 'Registrieren', logout: 'Abmelden',
            profile: 'Profil', settings: 'Einstellungen', favorites: 'Favoriten', messages: 'Nachrichten',
            search: 'Suchen', cancel: 'Abbrechen', confirm: 'Bestätigen', save: 'Speichern',
            heroTitle: 'Entdecke den Nächsten Musikstar', heroSubtitle: 'XMUSIC — Musiker und Investoren verbinden',
            explore: 'Erkunden', featuredProjects: 'Empfohlene Projekte', viewAll: 'Alle Anzeigen'
        },
        pt: {
            home: 'Início', discover: 'Descobrir', nearby: 'Artistas Próximos', invest: 'Meus Investimentos',
            create: 'Iniciar Financiamento', login: 'Entrar', register: 'Cadastrar', logout: 'Sair',
            profile: 'Perfil', settings: 'Configurações', favorites: 'Favoritos', messages: 'Mensagens',
            search: 'Buscar', cancel: 'Cancelar', confirm: 'Confirmar', save: 'Salvar',
            heroTitle: 'Descubra a Próxima Estrela Musical', heroSubtitle: 'XMUSIC — Conectando Músicos e Investidores',
            explore: 'Explorar', featuredProjects: 'Projetos em Destaque', viewAll: 'Ver Tudo'
        },
        ru: {
            home: 'Главная', discover: 'Открытия', nearby: 'Близкие Артисты', invest: 'Мои Инвестиции',
            create: 'Начать Сбор', login: 'Вход', register: 'Регистрация', logout: 'Выход',
            profile: 'Профиль', settings: 'Настройки', favorites: 'Избранное', messages: 'Сообщения',
            search: 'Поиск', cancel: 'Отмена', confirm: 'Подтвердить', save: 'Сохранить',
            heroTitle: 'Откройте Следующую Музыкальную Звезду', heroSubtitle: 'XMUSIC — Связь Музыкантов и Инвесторов',
            explore: 'Исследовать', featuredProjects: 'Избранные Проекты', viewAll: 'Смотреть Всё'
        },
        zht: {
            home: '首頁', discover: '發現', nearby: '附近音樂人', invest: '我的投資',
            create: '發起融資', login: '登錄', register: '註冊', logout: '退出',
            profile: '個人中心', settings: '設置', favorites: '收藏', messages: '消息',
            search: '搜索', cancel: '取消', confirm: '確認', save: '保存',
            heroTitle: '發現下一個音樂巨星', heroSubtitle: 'XMUSIC — 連接音樂人與投資者的橋樑',
            explore: '探索', featuredProjects: '精選項目', viewAll: '查看全部'
        }
    };

    // ==================== 状态管理 ====================
    const State = {
        currentLang: localStorage.getItem('xmusic-lang') || CONFIG.defaultLang,
        currentCurrency: localStorage.getItem('xmusic-currency') || CONFIG.defaultCurrency,
        user: JSON.parse(localStorage.getItem('xmusic-user') || 'null'),
        wallet: JSON.parse(localStorage.getItem('xmusic-wallet') || 'null'),
        
        setLang(lang) {
            this.currentLang = lang;
            localStorage.setItem('xmusic-lang', lang);
            document.documentElement.lang = lang;
            this.updatePageText();
        },
        
        setCurrency(currency) {
            this.currentCurrency = currency;
            localStorage.setItem('xmusic-currency', currency);
            this.updateCurrencyDisplay();
        },
        
        t(key) {
            return TRANSLATIONS[this.currentLang]?.[key] || TRANSLATIONS[CONFIG.defaultLang][key] || key;
        },
        
        formatCurrency(amount) {
            const curr = CONFIG.currencies[this.currentCurrency];
            const converted = amount * curr.rate;
            return `${curr.symbol}${converted.toLocaleString()}`;
        },
        
        updatePageText() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (el.tagName === 'INPUT' && el.placeholder) {
                    el.placeholder = this.t(key);
                } else {
                    el.textContent = this.t(key);
                }
            });
        },
        
        updateCurrencyDisplay() {
            document.querySelectorAll('[data-currency]').forEach(el => {
                const amount = parseFloat(el.getAttribute('data-currency'));
                if (!isNaN(amount)) {
                    el.textContent = this.formatCurrency(amount);
                }
            });
            const currencyDisplay = document.getElementById('currentCurrency');
            if (currencyDisplay) {
                currencyDisplay.textContent = this.currentCurrency;
            }
        }
    };

    // ==================== Web3 钱包 ====================
    const Wallet = {
        async connect() {
            if (!window.ethereum) {
                alert('请安装 MetaMask 或其他 Web3 钱包');
                window.open('https://metamask.io', '_blank');
                return null;
            }
            
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                
                const walletData = {
                    address: accounts[0],
                    chainId: chainId,
                    connected: true
                };
                
                State.wallet = walletData;
                localStorage.setItem('xmusic-wallet', JSON.stringify(walletData));
                this.updateUI();
                
                // 监听账户变化
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length === 0) {
                        this.disconnect();
                    } else {
                        walletData.address = accounts[0];
                        State.wallet = walletData;
                        localStorage.setItem('xmusic-wallet', JSON.stringify(walletData));
                        this.updateUI();
                    }
                });
                
                return walletData;
            } catch (err) {
                console.error('Wallet connection failed:', err);
                return null;
            }
        },
        
        disconnect() {
            State.wallet = null;
            localStorage.removeItem('xmusic-wallet');
            this.updateUI();
        },
        
        updateUI() {
            const connectBtn = document.getElementById('walletConnectBtn');
            const walletDisplay = document.getElementById('walletDisplay');
            
            if (State.wallet?.connected) {
                if (connectBtn) connectBtn.classList.add('hidden');
                if (walletDisplay) {
                    walletDisplay.classList.remove('hidden');
                    const shortAddress = `${State.wallet.address.slice(0, 6)}...${State.wallet.address.slice(-4)}`;
                    walletDisplay.querySelector('.wallet-address').textContent = shortAddress;
                }
            } else {
                if (connectBtn) connectBtn.classList.remove('hidden');
                if (walletDisplay) walletDisplay.classList.add('hidden');
            }
        },
        
        async signMessage(message) {
            if (!State.wallet?.connected) return null;
            try {
                const signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, State.wallet.address]
                });
                return signature;
            } catch (err) {
                console.error('Sign failed:', err);
                return null;
            }
        }
    };

    // ==================== UI 控制 ====================
    const UI = {
        init() {
            // 初始化语言
            State.updatePageText();
            State.updateCurrencyDisplay();
            Wallet.updateUI();
            
            // 绑定事件
            this.bindEvents();
        },
        
        bindEvents() {
            // 货币选择
            document.querySelectorAll('.currency-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const currency = e.target.dataset.currency;
                    if (currency) {
                        State.setCurrency(currency);
                        this.closeModal('currencyModal');
                    }
                });
            });
            
            // 语言选择
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = e.target.dataset.lang;
                    if (lang) {
                        State.setLang(lang);
                        this.closeModal('langModal');
                    }
                });
            });
            
            // 钱包连接
            const walletBtn = document.getElementById('walletConnectBtn');
            if (walletBtn) {
                walletBtn.addEventListener('click', () => Wallet.connect());
            }
            
            // 钱包断开
            const disconnectBtn = document.getElementById('walletDisconnectBtn');
            if (disconnectBtn) {
                disconnectBtn.addEventListener('click', () => Wallet.disconnect());
            }
        },
        
        openModal(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        },
        
        closeModal(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        },
        
        toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('expanded');
            }
        }
    };

    // ==================== 投资系统 ====================
    const Investment = {
        tiers: [
            { name: 'supporter', min: 10, benefits: ['基础收益分成'] },
            { name: 'fan', min: 50, benefits: ['优先访问权', '基础收益分成'] },
            { name: 'collector', min: 200, benefits: ['独家内容', '优先访问权', '基础收益分成'] },
            { name: 'producer', min: 500, benefits: ['决策参与权', '独家内容', '优先访问权', '基础收益分成'] }
        ],
        
        roles: [
            { name: 'operations', min: 1000, share: 5, desc: '运营、推广、招募' },
            { name: 'investor', min: 100, share: null, desc: '提供资金支持' },
            { name: 'agent', min: 500, share: 3, desc: '连接资源、组织演出' },
            { name: 'promoter', min: 200, share: 2, desc: '社交媒体推广' },
            { name: 'fan', min: 10, share: null, desc: '支持艺人' }
        ],
        
        async invest(projectId, amount, tier) {
            if (!State.wallet?.connected) {
                alert('请先连接钱包');
                return false;
            }
            
            // 模拟投资流程
            console.log(`Investing ${amount} in project ${projectId} as ${tier}`);
            return true;
        }
    };

    // ==================== 初始化 ====================
    document.addEventListener('DOMContentLoaded', () => {
        UI.init();
    });

    // 全局暴露
    window.XMUSIC = {
        CONFIG,
        State,
        Wallet,
        UI,
        Investment,
        t: (key) => State.t(key),
        formatCurrency: (amount) => State.formatCurrency(amount)
    };

})();