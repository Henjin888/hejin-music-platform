/**
 * XMUSIC 安全工具模块
 * 提供XSS防护、输入验证、CSRF防护等安全功能
 * 版本: 1.0.0
 */

(function(global) {
    'use strict';

    // ========== XSS 防护 ==========
    
    /**
     * 转义HTML特殊字符，防止XSS攻击
     * @param {string} text - 需要转义的文本
     * @returns {string} 转义后的安全文本
     */
    function escapeHtml(text) {
        if (typeof text !== 'string') return '';
        
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        
        return text.replace(/[&<>"'\/]/g, char => htmlEscapes[char]);
    }

    /**
     * 清理URL，防止javascript:协议攻击
     * @param {string} url - 需要清理的URL
     * @returns {string} 安全的URL或空字符串
     */
    function sanitizeUrl(url) {
        if (typeof url !== 'string') return '';
        
        const trimmed = url.trim().toLowerCase();
        
        // 阻止危险协议
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
        for (const protocol of dangerousProtocols) {
            if (trimmed.startsWith(protocol)) {
                console.warn('Blocked dangerous URL protocol:', protocol);
                return '';
            }
        }
        
        return url;
    }

    // ========== 输入验证 ==========
    
    /**
     * 验证手机号格式（中国手机号）
     * @param {string} phone - 手机号
     * @returns {boolean} 是否有效
     */
    function validatePhone(phone) {
        if (typeof phone !== 'string') return false;
        return /^1[3-9]\d{9}$/.test(phone.trim());
    }

    /**
     * 验证邮箱格式
     * @param {string} email - 邮箱地址
     * @returns {boolean} 是否有效
     */
    function validateEmail(email) {
        if (typeof email !== 'string') return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    /**
     * 验证验证码格式
     * @param {string} code - 验证码
     * @param {number} length - 验证码长度，默认6位
     * @returns {boolean} 是否有效
     */
    function validateCode(code, length = 6) {
        if (typeof code !== 'string') return false;
        const regex = new RegExp(`^\\d{${length}}$`);
        return regex.test(code.trim());
    }

    /**
     * 验证以太坊钱包地址
     * @param {string} address - 钱包地址
     * @returns {boolean} 是否有效
     */
    function validateEthAddress(address) {
        if (typeof address !== 'string') return false;
        return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
    }

    /**
     * 验证金额
     * @param {*} amount - 金额
     * @param {object} options - 验证选项
     * @returns {boolean} 是否有效
     */
    function validateAmount(amount, options = {}) {
        const num = parseFloat(amount);
        if (isNaN(num) || !isFinite(num)) return false;
        
        const { min = 0, max = Infinity, decimals = 2 } = options;
        
        if (num < min || num > max) return false;
        
        // 检查小数位数
        const decimalStr = amount.toString().split('.')[1];
        if (decimalStr && decimalStr.length > decimals) return false;
        
        return true;
    }

    /**
     * 验证字符串长度
     * @param {string} str - 字符串
     * @param {object} options - 验证选项 { min, max }
     * @returns {boolean} 是否有效
     */
    function validateLength(str, options = {}) {
        if (typeof str !== 'string') return false;
        const { min = 0, max = Infinity } = options;
        const length = str.trim().length;
        return length >= min && length <= max;
    }

    // ========== 类型检查 ==========
    
    function isValidNumber(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }

    function isValidString(value) {
        return typeof value === 'string' && value.trim().length > 0;
    }

    function isValidObject(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    // ========== 工具函数 ==========
    
    /**
     * 生成随机字符串
     * @param {number} length - 长度
     * @returns {string} 随机字符串
     */
    function generateRandomString(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const randomValues = new Uint8Array(length);
        
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(randomValues);
            for (let i = 0; i < length; i++) {
                result += chars[randomValues[i] % chars.length];
            }
        } else {
            // 降级方案
            for (let i = 0; i < length; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        
        return result;
    }

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

    // ========== 导出 ==========
    const SecurityUtils = {
        // XSS防护
        escapeHtml,
        sanitizeUrl,
        
        // 输入验证
        validatePhone,
        validateEmail,
        validateCode,
        validateEthAddress,
        validateAmount,
        validateLength,
        
        // 类型检查
        isValidNumber,
        isValidString,
        isValidObject,
        
        // 工具函数
        generateRandomString,
        debounce,
        throttle
    };

    // 兼容CommonJS、AMD和全局变量
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SecurityUtils;
    } else if (typeof define === 'function' && define.amd) {
        define(() => SecurityUtils);
    } else {
        global.SecurityUtils = SecurityUtils;
    }

})(typeof window !== 'undefined' ? window : this);