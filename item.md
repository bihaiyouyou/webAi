项目概述：
利用 Cloudflare Pages 的便捷性来托管静态资源，同时通过 Workers 提供所需的动态功能。
前端页面：利用 Cloudflare Pages 来托管静态网页内容（HTML、CSS、JavaScript)，包括用户注册登录界面。
后端逻辑：使用 Cloudflare Workers 编写后端逻辑，处理用户注册、登录、API Key生成等操作。
Worker 可以通过 fetch 请求与外部数据库通信，保存或检索必要的数据。
数据库集成：选择合适的数据库服务存储用户信息、API Key及其使用情况等数据。确保你的 Worker 能够安全地访问数据库。
API Key 计费逻辑：在 Worker 中实现相应的计费逻辑，根据API Key的使用情况进行计费或者限制访问。

项目实施方案：
基于Cloudflare的API密钥管理系统
通过Cloudflare Pages和Workers可以完全重构该项目，创建一个无需传统服务器的API密钥管理系统。以下是实现方案和部署教程。
架构设计
整体架构如下：
前端: Cloudflare Pages托管静态内容
后端: Cloudflare Workers处理所有API请求
数据库: Cloudflare D1 (SQLite数据库)
认证: Cloudflare Access提供安全认证

一、项目结构

api-key-system/
├── frontend/                   # Cloudflare Pages前端代码
│   ├── public/                 # 静态资源
│   ├── src/                    # 源代码
│   │   ├── components/         # React组件
│   │   ├── pages/              # 页面组件
│   │   ├── App.js              # 主应用组件
│   │   ├── index.js            # 入口文件
│   ├── package.json            # 项目依赖
│   └── wrangler.toml           # Pages配置
└── backend/                    # Cloudflare Workers后端代码
    ├── src/                    # 源代码
    │   ├── handlers/           # 请求处理程序
    │   ├── models/             # 数据模型
    │   ├── utils/              # 工具函数
    │   └── index.js            # 入口文件
    ├── db/                     # 数据库迁移脚本
    │   └── schema.sql          # 数据库架构
    ├── package.json            # 项目依赖
    └── wrangler.toml           # Workers配置


二、前端实现 (React)
创建React应用，托管在Cloudflare Pages：



三、后端实现 (Cloudflare Workers)
1. 设置Worker项目
# 安装Wrangler CLI
npm install -g wrangler

# 创建Worker项目
mkdir -p backend
cd backend
wrangler init

# 设置D1数据库
wrangler d1 create api-key-system
2. 数据库架构 (schema.sql)
-- 用户表
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_admin INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

-- API密钥表
CREATE TABLE api_keys (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  last_used_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 用户计费表
CREATE TABLE user_billing (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  plan TEXT DEFAULT 'free',
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER DEFAULT 100,
  last_billing_date TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- API使用日志表
CREATE TABLE api_usage_logs (
  id INTEGER PRIMARY KEY,
  api_key_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  endpoint TEXT NOT NULL,
  response_code INTEGER NOT NULL,
  response_time REAL NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 账单表
CREATE TABLE bills (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  call_count INTEGER NOT NULL,
  billing_period TEXT NOT NULL,
  plan TEXT NOT NULL,
  paid INTEGER DEFAULT 0,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(user_id, billing_period),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 初始管理员
INSERT INTO users (username, password, email, is_admin, created_at)
VALUES ('admin', '$2b$10$DWL.OvQH8wYlG.DijCJ3QOI0Zj/dR2ZhPUNTZT0rSgUJjwGYQ.0Tu', 'admin@example.com', 1, datetime('now'));

-- 管理员API Key
INSERT INTO api_keys (user_id, api_key, created_at)
VALUES (1, 'sk_admin_00000000000000000000000000000000', datetime('now'));

-- 管理员计费信息
INSERT INTO user_billing (user_id, plan, usage_limit)
VALUES (1, 'enterprise', 9999999);
3. Worker配置 (wrangler.toml)
name = "api-key-system"
main = "src/index.js"
compatibility_date = "2023-01-01"

[vars]
JWT_SECRET = "your-secret-key-change-this"
API_PREFIX = "sk_"
API_KEY_LENGTH = "32"
FREE_LIMIT = "100"

# 绑定D1数据库
[[d1_databases]]
binding = "DB"
database_name = "api-key-system"
database_id = "替换为你的D1数据库ID"

# 路由
[[routes]]
pattern = "/api/*"
script = "src/index.js"

# 设置KV命名空间存储会话和缓存
[[kv_namespaces]]
binding = "SESSIONS"
id = "替换为你的KV命名空间ID"

4. Worker入口文件 (index.js)

import { Router } from 'itty-router';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from '@tsndr/cloudflare-worker-jwt';

// 创建路由器
const router = Router();

// 中间件 - 验证JWT令牌
async function authMiddleware(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: '未授权访问' 
    }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // 验证令牌
    const isValid = await jwt.verify(token, env.JWT_SECRET);
    if (!isValid) throw new Error('无效令牌');
    
    // 解码令牌获取用户信息
    const payload = jwt.decode(token).payload;
    request.user = payload;
    
    return null; // 继续处理请求
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: '无效的认证令牌' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 中间件 - 验证管理员权限
async function adminMiddleware(request) {
  if (!request.user || !request.user.is_admin) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: '需要管理员权限' 
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return null; // 继续处理请求
}

// 工具函数 - 生成API Key
function generateApiKey(prefix, length) {
  const randomBytes = new Uint8Array(length / 2);
  crypto.getRandomValues(randomBytes);
  return prefix + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// 注册路由

// 注册新用户
router.post('/api/auth/register', async (request, env) => {
  try {
    const { username, email, password } = await request.json();
    
    // 验证输入
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '请提供完整的注册信息' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查用户名是否已存在
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE username = ?'
    ).bind(username).first();
    
    if (existingUser) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '用户名已存在' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (existingEmail) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '邮箱已被注册' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 生成API Key
    const apiKey = generateApiKey(env.API_PREFIX, parseInt(env.API_KEY_LENGTH));
    
    // 当前时间
    const now = new Date().toISOString();
    
    // 开始事务
    const db = env.DB;
    
    // 创建用户
    const insertUserResult = await db.prepare(
      'INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, ?)'
    ).bind(username, hashedPassword, email, now).run();
    
    const userId = insertUserResult.meta.last_row_id;
    
    // 创建API Key
    await db.prepare(
      'INSERT INTO api_keys (user_id, api_key, created_at) VALUES (?, ?, ?)'
    ).bind(userId, apiKey, now).run();
    
    // 创建计费记录
    await db.prepare(
      'INSERT INTO user_billing (user_id, plan, usage_limit) VALUES (?, ?, ?)'
    ).bind(userId, 'free', parseInt(env.FREE_LIMIT)).run();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: '注册成功',
      api_key: apiKey
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: '注册失败: ' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// 用户登录
router.post('/api/auth/login', async (request, env) => {
  try {
    const { username, password } = await request.json();
    
    // 验证输入
    if (!username || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '请提供用户名和密码' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 获取用户信息
    const user = await env.DB.prepare(
      'SELECT id, username, password, email, is_admin, status FROM users WHERE username = ?'
    ).bind(username).first();
    
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '用户名或密码错误' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 验证密码
    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '用户名或密码错误' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查用户状态
    if (user.status !== 'active') {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '账户已被禁用' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 获取用户的API Key
    const apiKeyRow = await env.DB.prepare(
      'SELECT api_key FROM api_keys WHERE user_id = ? AND status = "active" LIMIT 1'
    ).bind(user.id).first();
    
    // 获取用户计费信息
    const billing = await env.DB.prepare(
      'SELECT plan, usage_count, usage_limit FROM user_billing WHERE user_id = ?'
    ).bind(user.id).first();
    
    // 生成JWT令牌
    const token = await jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin === 1
    }, env.JWT_SECRET, { expiresIn: '24h' });
    
    return new Response(JSON.stringify({ 
      success: true, 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin === 1
      },
      api_key: apiKeyRow?.api_key,
      billing
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: '登录失败: ' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// 处理所有请求
export default {
  async fetch(request, env, ctx) {
    // 设置CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    // 处理OPTIONS请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    // 为所有响应添加CORS头
    const response = await router.handle(request, env, ctx);
    
    // 复制原始响应并添加CORS头
    const newResponse = new Response(response.body, response);
    Object.keys(corsHeaders).forEach(key => {
      newResponse.headers.set(key, corsHeaders[key]);
    });
    
    return newResponse;
  }
};

四、部署流程
1. 部署数据库
cd backend
wrangler publish

2. 部署后端Workers
cd backend
wrangler publish

3. 部署前端Pages
cd frontend
wrangler pages publish build --project-name=api-key-system

4. 配置Pages与Workers整合
登录Cloudflare控制台
导航到Pages项目设置
在"函数"部分添加Worker路由规则：
路由: /api/*
Worker: api-key-system