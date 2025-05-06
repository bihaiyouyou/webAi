// API基础配置
export const API_BASE_URL = 'https://api-key-system.8901530.workers.dev';
export const API_FALLBACK_URL = '/api'; // 备用URL用于Pages与Workers整合

// 认证配置
export const AUTH_TOKEN_KEY = 'api_key_auth_token';
export const USER_DATA_KEY = 'api_key_user_data';

// 常量定义
export const API_KEY_STATES = {
  ACTIVE: true,
  INACTIVE: false
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