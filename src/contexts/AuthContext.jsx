import { createContext, useState, useEffect, useContext } from 'react';
import { AUTH_TOKEN_KEY } from '../config';
import apiService from '../services/api';

// 用户数据本地存储键
const USER_DATA_KEY = 'user_data';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化：从本地存储加载用户
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_DATA_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem(USER_DATA_KEY);
      }
    }
    setLoading(false);
  }, []);

  // 注册
  const register = async (userData) => {
    setError(null);
    try {
      console.log('正在注册新用户:', userData.email);
      // 开发模式下，如果API不可用，使用模拟数据
      if (import.meta.env.DEV && (userData.email.includes('@test.com') || import.meta.env.VITE_MOCK_API === 'true')) {
        console.log('使用模拟注册数据');
        // 模拟后端处理延迟
        await new Promise(r => setTimeout(r, 800)); 
        return {
          success: true,
          message: '注册成功，请登录'
        };
      }
      
      const result = await apiService.auth.register(userData);
      console.log('注册结果:', result);
      return result;
    } catch (err) {
      console.error('注册处理错误:', err);
      setError(err);
      throw err;
    }
  };

  // 登录
  const login = async (credentials) => {
    setError(null);
    try {
      console.log('正在登录用户:', credentials.email);
      
      // 开发模式下，如果API不可用，使用模拟数据
      if (import.meta.env.DEV && (credentials.email.includes('@test.com') || import.meta.env.VITE_MOCK_API === 'true')) {
        console.log('使用模拟登录数据');
        // 模拟后端处理延迟
        await new Promise(r => setTimeout(r, 800));
        
        const mockData = {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 'user-' + Date.now(),
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'user',
            created_at: new Date().toISOString()
          }
        };
        
        setUser(mockData.user);
        localStorage.setItem(AUTH_TOKEN_KEY, mockData.token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockData.user));
        return mockData;
      }
      
      const data = await apiService.auth.login(credentials);
      setUser(data.user);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // 登出
  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  };

  // 检查是否已认证
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      register,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，方便使用
export const useAuth = () => useContext(AuthContext); 