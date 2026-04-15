# Sy Admin

企业级后台前端工程骨架，当前仅完成 Step 2 的项目初始化与工程化配置，不包含业务模块页面。

## 技术栈

- Vue 3 + `script setup`
- Vite
- Vue Router
- Pinia
- Axios
- Element Plus
- Less + CSS Variables
- ESLint + Prettier
- Husky + lint-staged
- Element Plus 组件、图标、样式按需引入
- light / dark 主题切换
- `rollup-plugin-visualizer`

## 启动

```bash
pnpm install
pnpm dev
```

## 常用命令

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm build
pnpm analyze
```

## 环境变量

默认通过 Vite 代理把 `/admin` 和 `/upload` 请求转发到 `http://127.0.0.1:8001`。

- `.env.development`：开发环境
- `.env.production`：生产环境
- `.env.analyze`：开启打包分析

## 目录结构

```text
src
├─ api
├─ config
├─ constants
├─ http
├─ layout
├─ router
├─ stores
├─ styles
├─ utils
└─ views
```

## 当前状态

- 已完成工程初始化与基础壳子搭建
- 已预留鉴权、请求层、主题切换、路由守卫能力
- 业务页面与真实接口联调留在后续步骤
