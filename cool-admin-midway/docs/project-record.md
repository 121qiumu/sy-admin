# 项目记录

## 协作规则

- 当前项目按步骤推进，不跨步执行。
- 从第 2 步开始，每次继续之前，必须先读取本文件。
- 每一步结束后都要同步更新本文件，避免上下文丢失。

## 项目目标

从 0 到 1 搭建一个真实可落地的企业级前端后台管理系统。

固定前端技术栈：

- Vue 3 + `script setup`
- Vite
- Vue Router
- Pinia
- Axios
- Element Plus
- Less + CSS Variables
- pnpm
- ESLint + Prettier
- `.editorconfig`
- Husky + lint-staged
- Element Plus 组件、图标、样式自动按需导入
- `rollup-plugin-visualizer`
- 支持 Element Plus light / dark 主题

## 当前上下文

- 工作目录：`d:\My_Project\sy-admin\cool-admin-midway`
- 当前识别到的后端项目：Midway + cool-admin Node 版本
- 本轮完成步骤：`Step 1 - 提炼前端可直接使用的接口文档`

## 本步产出

- 项目记录：[docs/project-record.md](./project-record.md)
- 接口对接文档：[docs/backend-interface-extraction.md](./backend-interface-extraction.md)

## 本步结论

### 1. 后端路由规则已确认

- `@CoolController` 会根据控制器文件路径自动生成前缀。
- 管理后台接口统一落在 `/admin/...`。
- 路由模式可按下面规则理解：

`src/modules/<module>/controller/admin/<path>.ts` -> `/admin/<module>/<path>`

示例：

- `src/modules/base/controller/admin/open.ts` -> `/admin/base/open`
- `src/modules/base/controller/admin/sys/user.ts` -> `/admin/base/sys/user`
- `src/modules/dict/controller/admin/info.ts` -> `/admin/dict/info`

### 2. 后端统一响应格式已确认

绝大多数接口返回：

```json
{
  "code": 1000,
  "message": "success",
  "data": {}
}
```

约定说明：

- 成功码：`1000`
- 常见失败码：`1001`、`1002`、`1003`
- 分页接口的 `data` 结构是：

```json
{
  "list": [],
  "pagination": {
    "page": 1,
    "size": 15,
    "total": 0
  }
}
```

### 3. 鉴权方式已确认

- 管理后台鉴权读取请求头 `Authorization`
- 这里传的是“原始 token 字符串”
- 不是 `Bearer <token>` 这种格式
- 刷新 token 接口：`GET /admin/base/open/refreshToken?refreshToken=...`

### 4. 已提炼的接口范围

本轮已经整理完成以下管理后台核心模块：

- 登录、验证码、刷新 token
- 当前登录人信息、权限菜单、上传、退出
- 系统用户
- 系统角色
- 系统菜单
- 系统部门
- 系统参数
- 系统日志
- 字典类型 / 字典数据
- 文件空间分类 / 文件空间文件
- 数据回收站
- 任务调度
- C 端用户管理 / 收货地址管理
- 插件管理

### 5. 明确不作为前端运行时依赖的接口

- `/admin/base/open/eps`
- `/swagger/json`

原因：

- `cool.eps` 在本地开发配置中开启，在生产配置中关闭
- 这些接口适合开发辅助，不适合作为线上前端运行时强依赖

## 联调注意事项

- 登录参数里的 `verifyCode` 在 DTO 里被写成 `number`，但服务层按字符串验证码处理。前端建议按字符串输入处理。
- `/admin/base/comm/permmenu` 返回的是“权限数组 + 平铺菜单数组”，前端需要自己转树。
- `/admin/base/comm/upload` 成功后直接返回字符串 URL，不是对象。
- `/admin/base/open/html` 和 `/admin/base/sys/param/html` 返回的是原始 HTML 文本，不是统一 JSON 包装。
- 任务接口 `/admin/task/info/once`、`/start`、`/stop` 的控制器里没有显式 `return`，正式联调时要优先验证返回体。
- 系统用户编辑页的角色勾选，建议以 `/admin/base/sys/user/info` 返回的 `roleIdList` 为准，不要依赖分页列表里的角色字段。

## 下一步入口

下一步建议执行：

`Step 2 - 先初始化前端工程骨架与基础规范，不做业务页，只落通用底座`

建议范围：

- 初始化前端目录结构
- 配置 Vite / ESLint / Prettier / EditorConfig / Husky / lint-staged
- 接入 Vue Router / Pinia / Axios / Element Plus 自动导入
- 建立请求层、鉴权存储、基础 Layout、主题变量基线
- 但正式开页面之前，先读取本文件和接口文档

## 下次开始前必须做的事

1. 先读取 [docs/project-record.md](./project-record.md)
2. 再读取 [docs/backend-interface-extraction.md](./backend-interface-extraction.md)
3. 只执行当前步骤，不补做后续业务页面

## 最近更新时间

- `2026-04-14`：完成 Step 1，建立项目记录与首版前端接口对接文档
