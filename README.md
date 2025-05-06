# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# API密钥管理系统

一个完整的API密钥管理解决方案，包含用户认证、API密钥生成、使用统计和计费功能。

## 系统架构

- **前端**：React + Chakra UI
- **后端**：Cloudflare Workers
- **数据库**：Cloudflare D1 (SQLite)

## 功能特性

- 用户注册与登录
- API密钥生成和管理
- 使用统计和分析
- 计费管理
- 文档和支持

## 快速开始

### 前端开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 测试账号

在开发模式下，可以使用以下方式快速测试：

1. 注册/登录时使用`@test.com`域名的邮箱（如`user@test.com`）
2. 使用任意密码（至少6个字符）

系统会自动创建模拟用户数据，无需真实后端API。

## 后端API

后端已部署到Cloudflare Workers:
- 生产环境: `https://api-key-worker.8901530.workers.dev`

### API端点

| 路径 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/auth/register` | POST | 用户注册 | 否 |
| `/auth/login` | POST | 用户登录 | 否 |
| `/api-keys` | GET | 获取所有API密钥 | 是 |
| `/api-keys` | POST | 创建API密钥 | 是 |
| `/api-keys/:id` | GET | 获取单个API密钥 | 是 |
| `/api-keys/:id` | PATCH | 更新API密钥 | 是 |
| `/api-keys/:id` | DELETE | 删除API密钥 | 是 |
| `/stats` | GET | 获取使用统计 | 是 |
| `/verify` | POST | 验证API密钥 | 否 |

## 问题排查

### 连接问题

如果遇到API连接问题，可能是由于以下原因：

1. CORS限制 - 检查浏览器控制台
2. 网络连接 - 确保能访问Cloudflare服务
3. API服务不可用 - 使用`@test.com`邮箱进行模拟测试

### 本地开发

如果需要在无网络环境开发，请使用以下方法启用模拟API:

1. 创建`.env.local`文件并添加`VITE_MOCK_API=true`
2. 重启开发服务器

## 项目结构

```
api-key-frontend/
├── public/             # 静态资源
├── src/                # 源代码
│   ├── components/     # UI组件
│   ├── contexts/       # 上下文(认证等)
│   ├── pages/          # 页面组件
│   ├── services/       # API服务
│   ├── App.jsx         # 应用入口
│   └── main.jsx        # 主渲染文件
└── package.json        # 项目依赖
```

## 部署信息

前端应用部署到Cloudflare Pages，后端Worker已部署到Cloudflare，数据库使用Cloudflare D1。

### Pages与Workers整合

通过Cloudflare Pages能够将API请求路由到Worker处理。配置方法：

1. 登录Cloudflare控制台
2. 导航到Pages项目设置
3. 在"函数"部分添加Worker路由规则：
   - 路由: `/api/*`
   - Worker: `api-key-system`

此配置允许前端应用通过相对路径 `/api/...` 访问API，无需跨域请求。

### 完整部署流程

```bash
# 1. 部署数据库
cd backend
wrangler d1 migrations apply api_keys_db

# 2. 部署后端Workers
cd backend
wrangler deploy

# 3. 部署前端Pages
cd api-key-frontend
npm run build
wrangler pages deploy dist

# 4. 在Cloudflare控制台配置Pages与Workers整合
# 设置路由: /api/* -> api-key-system
```

### 本地开发

```bash
# 前端开发服务器
cd api-key-frontend
npm run dev

# 后端开发
cd backend
wrangler dev
```
