# 后端接口提炼文档

## 文档目标

这份文档只站在前端开发视角，提炼“可直接用于 Vue 管理后台开发”的接口信息，不展开后端架构分析。

当前文档基于项目源码提炼，来源目录：

- `src/modules/**/controller/admin/**/*.ts`
- `src/modules/**/service/**/*.ts`
- `src/modules/**/entity/**/*.ts`
- `src/modules/base/middleware/authority.ts`
- `node_modules/@cool-midway/core/dist/decorator/controller.js`

## 一、通用约定

### 1.1 路由生成规则

管理后台接口统一使用：

`/admin/<module>/<controller-path>/<action>`

示例：

- `/admin/base/open/login`
- `/admin/base/comm/permmenu`
- `/admin/base/sys/user/page`
- `/admin/dict/info/data`
- `/admin/task/info/log`

### 1.2 标准 CRUD 约定

当控制器声明了 `api: ['add', 'delete', 'update', 'info', 'list', 'page']` 时，可直接按下面规则封装：

| 动作 | 方法 | 路径后缀 | 请求格式 |
| --- | --- | --- | --- |
| 新增 | `POST` | `/add` | JSON body，字段一般与实体一致 |
| 删除 | `POST` | `/delete` | `{ ids: number[] }` |
| 更新 | `POST` | `/update` | JSON body，必须带 `id` |
| 详情 | `GET` | `/info` | query: `id` |
| 列表 | `POST` | `/list` | JSON body，常用于下拉或非分页数据 |
| 分页 | `POST` | `/page` | JSON body，通常带 `page`、`size`、筛选项 |

注意：

- 不是 RESTful 风格，而是动作式接口
- `info` 用 `GET`
- 其余标准 CRUD 基本都是 `POST`

### 1.3 统一响应格式

绝大多数接口返回：

```json
{
  "code": 1000,
  "message": "success",
  "data": {}
}
```

分页返回的 `data`：

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

通用分页参数：

- `page`: 页码，默认 `1`
- `size`: 每页条数，默认 `15`
- `order`: 排序字段，默认 `id`
- `sort`: 排序方向，默认 `desc`
- `keyWord`: 通用关键字搜索字段，部分模块支持

### 1.4 鉴权规则

- 请求头：`Authorization`
- 值：直接放 token 原文
- 不要加 `Bearer `

示例：

```http
Authorization: eyJhbGciOi...
```

### 1.5 不建议前端运行时依赖的接口

- `GET /admin/base/open/eps`
- `GET /swagger/json`

原因是生产环境通常会关闭 `eps` 输出。

## 二、认证与后台壳子接口

### 2.1 开放接口前缀

前缀：`/admin/base/open`

#### `GET /admin/base/open/captcha`

用途：获取登录验证码

query：

- `width?`: number
- `height?`: number
- `color?`: string

返回 `data`：

```json
{
  "captchaId": "uuid",
  "data": "data:image/svg+xml;base64,..."
}
```

#### `POST /admin/base/open/login`

用途：后台登录

body：

```json
{
  "username": "admin",
  "password": "123456",
  "captchaId": "xxx",
  "verifyCode": "abcd"
}
```

返回 `data`：

```json
{
  "expire": 7200,
  "token": "xxx",
  "refreshExpire": 1296000,
  "refreshToken": "xxx"
}
```

联调备注：

- 源码里的 `verifyCode` 类型声明和实际处理不一致，前端按字符串提交最稳妥

#### `GET /admin/base/open/refreshToken`

用途：刷新 token

query：

- `refreshToken`: string

返回结构与登录接口一致。

#### `GET /admin/base/open/html`

用途：按参数 key 获取富文本内容

query：

- `key`: string

返回：原始 HTML 字符串，不是统一 JSON 包装。

#### `GET /admin/base/open/eps`

用途：开发辅助接口，返回实体与路径信息

说明：

- 可用于开发期辅助生成请求映射
- 不建议前端线上依赖

### 2.2 通用后台接口前缀

前缀：`/admin/base/comm`

#### `GET /admin/base/comm/person`

用途：获取当前登录人信息

返回字段重点：

- `id`
- `departmentId`
- `name`
- `username`
- `nickName`
- `headImg`
- `phone`
- `email`
- `remark`
- `status`

#### `POST /admin/base/comm/personUpdate`

用途：修改当前登录人资料

body 常用字段：

- `name`
- `nickName`
- `headImg`
- `phone`
- `email`
- `remark`
- `password?`
- `oldPassword?`

备注：

- 如果改密码，必须同时传 `oldPassword`

#### `GET /admin/base/comm/permmenu`

用途：获取当前用户权限与菜单

返回 `data`：

```json
{
  "perms": [
    "base:sys:user:page"
  ],
  "menus": []
}
```

备注：

- `perms` 是权限点数组
- `menus` 是平铺菜单数组，不是树
- 前端需要自己转成路由树 / 菜单树

#### `POST /admin/base/comm/upload`

用途：文件上传

请求类型：`multipart/form-data`

字段：

- 文件：第一个文件字段即可
- `key?`: string，可指定相对路径/文件名

返回 `data`：

- 直接返回上传后的文件 URL 字符串

#### `GET /admin/base/comm/uploadMode`

用途：获取上传模式

返回 `data`：

```json
{
  "mode": "local",
  "type": "local"
}
```

#### `POST /admin/base/comm/logout`

用途：退出登录

#### `GET /admin/base/comm/program`

用途：返回运行时类型

当前返回：`Node`

## 三、系统管理接口

### 3.1 系统用户

前缀：`/admin/base/sys/user`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`
- `POST /move`

新增/编辑主要字段：

- `departmentId`
- `name`
- `username`
- `password`
- `nickName`
- `headImg`
- `phone`
- `email`
- `remark`
- `status`
- `roleIdList: number[]`

分页查询参数：

- `page`
- `size`
- `keyWord`
- `status`
- `departmentIds: number[]`
- `order`
- `sort`

分页列表额外返回字段：

- `departmentName`
- `roleName`

详情额外返回字段：

- `departmentName`
- `roleIdList`

自定义接口：

#### `POST /admin/base/sys/user/move`

body：

```json
{
  "departmentId": 2,
  "userIds": [3, 4]
}
```

前端备注：

- 编辑页角色选中值要用详情接口里的 `roleIdList`
- `admin` 用户的很多变更会被后端限制，前端 UI 最好做保护

### 3.2 系统角色

前缀：`/admin/base/sys/role`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`

主要字段：

- `name`
- `label`
- `remark`
- `relevance`
- `menuIdList: number[]`
- `departmentIdList: number[]`

分页查询参数：

- `page`
- `size`
- `keyWord`
- `order`
- `sort`

说明：

- 详情接口会返回 `menuIdList` 和 `departmentIdList`
- 非超管看到的角色范围会受后端权限限制

### 3.3 系统部门

前缀：`/admin/base/sys/department`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `POST /list`
- `POST /order`

主要字段：

- `name`
- `parentId`
- `orderNum`

列表返回补充字段：

- `parentName`

删除时建议 body：

```json
{
  "ids": [1, 2],
  "deleteUser": false
}
```

说明：

- 如果 `deleteUser = true`，后端会同时删除部门下用户
- 如果不传或为 `false`，后端会把这些用户迁移到顶级部门

排序接口：

#### `POST /admin/base/sys/department/order`

body：

- 传部门数组
- 每项至少应包含 `id`
- 实际可一并传 `parentId`、`orderNum`

### 3.4 系统菜单

前缀：`/admin/base/sys/menu`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`
- `POST /parse`
- `POST /create`
- `POST /export`
- `POST /import`

主要字段：

- `parentId`
- `name`
- `router`
- `perms`
- `type`
- `icon`
- `orderNum`
- `viewPath`
- `keepAlive`
- `isShow`

字段说明：

- `type`: `0` 目录，`1` 菜单，`2` 按钮

自定义接口：

#### `POST /admin/base/sys/menu/parse`

body：

```json
{
  "entity": "实体源码字符串",
  "controller": "控制器源码字符串",
  "module": "模块名"
}
```

用途：代码生成辅助，不作为普通后台页面首批必做接口。

#### `POST /admin/base/sys/menu/create`

用途：根据传入代码片段直接生成后端代码，属于开发辅助接口。

#### `POST /admin/base/sys/menu/export`

body：

```json
{
  "ids": [1, 2]
}
```

返回：菜单树结构。

#### `POST /admin/base/sys/menu/import`

body：

```json
{
  "menus": []
}
```

### 3.5 系统参数

前缀：`/admin/base/sys/param`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /page`
- `GET /html`

主要字段：

- `keyName`
- `name`
- `data`
- `dataType`
- `remark`

字段说明：

- `dataType`: `0` 字符串，`1` 富文本，`2` 文件

分页筛选参数：

- `page`
- `size`
- `keyWord`
- `dataType`
- `order`
- `sort`

#### `GET /admin/base/sys/param/html`

query：

- `key`: string

返回：原始 HTML 文本。

### 3.6 系统日志

前缀：`/admin/base/sys/log`

支持接口：

- `POST /page`
- `POST /clear`
- `POST /setKeep`
- `GET /getKeep`

分页筛选参数：

- `page`
- `size`
- `keyWord`
- `order`
- `sort`

分页返回重点字段：

- `id`
- `userId`
- `action`
- `ip`
- `params`
- `name`
- `createTime`

自定义接口：

#### `POST /admin/base/sys/log/setKeep`

body：

```json
{
  "value": 30
}
```

#### `GET /admin/base/sys/log/getKeep`

用途：获取日志保留时长

## 四、业务基础模块接口

### 4.1 字典类型

前缀：`/admin/dict/type`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`

主要字段：

- `name`
- `key`

### 4.2 字典数据

前缀：`/admin/dict/info`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`
- `POST /data`
- `GET /types`

主要字段：

- `typeId`
- `name`
- `value`
- `orderNum`
- `remark`
- `parentId`

`list` 查询参数：

- `typeId`
- `keyWord`
- `order`
- `sort`

#### `POST /admin/dict/info/data`

用途：批量获取字典数据

body：

```json
{
  "types": ["goodsType", "sex"]
}
```

返回示例：

```json
{
  "goodsType": [],
  "sex": []
}
```

#### `GET /admin/dict/info/types`

用途：获取全部字典类型

备注：

- 该接口已被标记为忽略 token，可用于登录前场景

### 4.3 文件空间分类

前缀：`/admin/space/type`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`

主要字段：

- `name`
- `parentId`

### 4.4 文件空间文件

前缀：`/admin/space/info`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`

主要字段：

- `url`
- `type`
- `classifyId`
- `fileId`
- `name`
- `size`
- `version`
- `key`

分页筛选参数：

- `type`
- `classifyId`
- `page`
- `size`

前端备注：

- 如果上传模式是本地，后端新增时会根据 `url` 自动回填 `key`

### 4.5 数据回收站

前缀：`/admin/recycle/data`

支持接口：

- `GET /info`
- `POST /page`
- `POST /restore`

分页返回重点字段：

- `entityInfo`
- `userId`
- `userName`
- `data`
- `url`
- `params`
- `count`
- `createTime`

#### `POST /admin/recycle/data/restore`

body：

```json
{
  "ids": [1, 2]
}
```

### 4.6 任务调度

前缀：`/admin/task/info`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /page`
- `POST /once`
- `POST /stop`
- `POST /start`
- `GET /log`

主要字段：

- `name`
- `cron`
- `repeatCount`
- `every`
- `remark`
- `status`
- `startDate`
- `endDate`
- `data`
- `service`
- `type`
- `taskType`

重要说明：

- 控制器会把前端传的 `repeatCount` 映射成实体字段 `limit`
- 所以前端表单建议继续使用 `repeatCount`

分页筛选参数：

- `page`
- `size`
- `status`
- `type`

自定义接口：

#### `POST /admin/task/info/once`

body：

```json
{
  "id": 1
}
```

#### `POST /admin/task/info/stop`

body：

```json
{
  "id": 1
}
```

#### `POST /admin/task/info/start`

body：

```json
{
  "id": 1,
  "type": 0
}
```

#### `GET /admin/task/info/log`

query：

- `id`
- `status?`
- `page`
- `size`
- `order`
- `sort`

### 4.7 C 端用户信息

前缀：`/admin/user/info`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`

主要字段：

- `unionid`
- `avatarUrl`
- `nickName`
- `phone`
- `gender`
- `status`
- `loginType`
- `password`
- `description`

分页筛选参数：

- `status`
- `gender`
- `loginType`
- `keyWord`
- `page`
- `size`

### 4.8 C 端用户地址

前缀：`/admin/user/address`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`

主要字段：

- `userId`
- `contact`
- `phone`
- `province`
- `city`
- `district`
- `address`
- `isDefault`

### 4.9 插件管理

前缀：`/admin/plugin/info`

支持接口：

- `POST /add`
- `POST /delete`
- `POST /update`
- `GET /info`
- `POST /list`
- `POST /page`
- `POST /install`

主要字段：

- `name`
- `description`
- `keyName`
- `hook`
- `readme`
- `version`
- `logo`
- `author`
- `status`
- `content`
- `tsContent`
- `pluginJson`
- `config`

#### `POST /admin/plugin/info/install`

用途：安装插件

请求类型：`multipart/form-data`

字段：

- 文件：插件压缩包
- `force?`: 是否强制安装

前端备注：

- 该接口被标记为忽略 token，但后台页仍建议在已登录环境下操作

## 五、前端封装建议

### 5.1 Axios 基础约定

- `baseURL` 指向后端域名
- 统一在请求拦截器注入 `Authorization`
- 统一把 `code !== 1000` 视为业务失败
- 对 `401` 做登录失效处理
- 对 `403` 做无权限处理

### 5.2 推荐优先封装的接口模块

建议按下面顺序落前端请求层：

1. `auth`
2. `app`
3. `system-user`
4. `system-role`
5. `system-menu`
6. `system-department`
7. `system-param`
8. `system-log`
9. `dict`
10. `space`

### 5.3 当前不建议首批接入的开发辅助接口

- `base/open/eps`
- `base/sys/menu/parse`
- `base/sys/menu/create`
- `base/coding/getModuleTree`
- `base/coding/createCode`

这些更偏内部开发工具，不是管理后台首批业务闭环必需项。
