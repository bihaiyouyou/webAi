import { API_BASE_URL, API_FALLBACK_URL, AUTH_TOKEN_KEY } from '../config';

// 优先使用本地API路径实现Pages与Workers整合
const API_URL = import.meta.env.PROD ? API_FALLBACK_URL : API_BASE_URL;

// 获取认证令牌
const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

// 处理API响应
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      const error = data.error || response.statusText;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error('API响应处理错误:', error);
    return Promise.reject('服务器返回无效数据');
  }
};

// 构建请求选项
const createOptions = (method, body = null, authRequired = true) => {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors'
  };

  if (authRequired) {
    const token = getToken();
    if (token) options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) options.body = JSON.stringify(body);
  return options;
};

// API服务
const apiService = {
  // 认证API
  auth: {
    register: async (userData) => {
      try {
        console.log('注册请求数据:', userData);
        const response = await fetch(`${API_URL}/auth/register`, createOptions('POST', userData, false));
        return await handleResponse(response);
      } catch (error) {
        console.error('注册请求失败:', error);
        throw error;
      }
    },
    
    login: async (credentials) => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, createOptions('POST', credentials, false));
        return await handleResponse(response);
      } catch (error) {
        console.error('登录请求失败:', error);
        throw error;
      }
    }
  },
  
  // API密钥管理
  apiKeys: {
    getAll: () => 
      fetch(`${API_URL}/api-keys`, createOptions('GET'))
        .then(handleResponse),
    
    create: (name) => 
      fetch(`${API_URL}/api-keys`, createOptions('POST', { name }))
        .then(handleResponse),
    
    getById: (id) => 
      fetch(`${API_URL}/api-keys/${id}`, createOptions('GET'))
        .then(handleResponse),
    
    update: (id, data) => 
      fetch(`${API_URL}/api-keys/${id}`, createOptions('PATCH', data))
        .then(handleResponse),
    
    delete: (id) => 
      fetch(`${API_URL}/api-keys/${id}`, createOptions('DELETE'))
        .then(handleResponse)
  },
  
  // 使用统计
  stats: {
    getAll: () => 
      fetch(`${API_URL}/stats`, createOptions('GET'))
        .then(handleResponse)
  },
  
  // 验证API密钥（无需认证的公共API）
  verify: (apiKey) => 
    fetch(`${API_URL}/verify`, createOptions('POST', { apiKey }, false))
      .then(handleResponse)
};

export default apiService; 