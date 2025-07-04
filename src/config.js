// API配置文件
export const API_BASE_URL = 'https://apiworker.幻银超i.top';

// 备用URL，如果主URL不可用
export const FALLBACK_API_URL = 'https://api-key-system.8901530.workers.dev';

// 认证Token存储键
export const AUTH_TOKEN_KEY = 'token';

// 常量定义
export const API_KEY_STATES = {
  ACTIVE: 'active',
  INACTIVE: 'disabled'
};

// 计费计划
export const BILLING_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise'
};

// 错误信息
export const ERROR_MESSAGES = {
  LOGIN_FAILED: '登录失败，请检查账号密码',
  REGISTER_FAILED: '注册失败，请检查信息或尝试其他账号',
  API_KEY_CREATE_FAILED: '创建API密钥失败',
  NETWORK_ERROR: '网络错误，请稍后重试',
  SESSION_EXPIRED: '会话已过期，请重新登录'
};

// 页面路由
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  API_KEYS: '/api-keys',
  API_KEY_DETAIL: '/api-keys/:id',
  USAGE: '/usage',
  BILLING: '/billing',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  DOCUMENTATION: '/documentation',
  SUPPORT: '/support',
  DOCS: '/docs',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users'
}; 