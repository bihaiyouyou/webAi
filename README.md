# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# API密钥管理系统

基于React和Chakra UI构建的API密钥管理系统前端，可部署在Cloudflare Pages。

## 功能特性

- 用户认证和注册
- API密钥创建和管理
- 使用统计和分析
- 多级权限控制
- 响应式界面设计

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 部署到Cloudflare Pages

1. 将代码推送到Git仓库（GitHub、GitLab、Bitbucket）

2. 在Cloudflare控制台创建新的Pages项目:
   - 连接您的Git仓库
   - 设置构建命令: `npm run build`
   - 设置输出目录: `dist`

3. 环境变量设置:
   - `VITE_API_URL`: 您的API后端地址

4. 构建设置:
   - 选择Node.js版本: 18或更高

5. 完成设置后，点击"保存并部署"。

## 文件结构

```
/src
  /components - 通用UI组件
  /pages - 页面组件
  /contexts - React上下文管理
  /utils - 工具函数
  /assets - 静态资源
```

## 使用的技术

- React 18
- React Router 6
- Chakra UI
- Axios
- Chart.js
- Vite

## 后端API

后端API使用Cloudflare Workers搭建，详情请参考API文档。
