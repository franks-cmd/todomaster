# TodoMaster — 待办事项管理应用

一款功能丰富的全栈待办事项管理应用，采用现代前端框架与轻量级后端架构，支持用户认证、分类管理、优先级设置、拖拽排序等功能。

## 功能特性

- **用户注册和登录** — 基于 JWT 的安全认证机制
- **待办事项 CRUD** — 创建、查看、编辑、删除待办事项
- **分类管理** — 自定义分类并设置颜色标识
- **优先级设置** — 支持高、中、低三级优先级
- **搜索和过滤** — 按关键词、分类、优先级、完成状态筛选
- **拖拽排序** — 通过拖拽自由调整待办事项顺序
- **截止日期** — 为待办事项设置截止日期
- **响应式设计** — 完美适配桌面端和移动端

## 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| **后端** | Express.js + TypeScript |
| **数据库** | SQLite + Drizzle ORM |
| **认证** | JWT + bcryptjs |

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装步骤

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd test1

# 2. 安装所有依赖
npm run install:all

# 3. 设置环境变量
cp .env.example .env

# 4. 初始化数据库（创建表结构）
npm run db:migrate

# 5. 填充示例数据
npm run db:seed

# 6. 启动开发服务器（前端 + 后端同时启动）
npm run dev
```

启动后访问：

- **前端**: http://localhost:5173
- **后端 API**: http://localhost:3001

### 演示账号

| 邮箱 | 密码 |
|------|------|
| demo@example.com | password123 |

## 项目结构

```
test1/
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── services/        # API 请求服务
│   │   ├── types/           # TypeScript 类型定义
│   │   ├── App.tsx          # 根组件
│   │   └── main.tsx         # 入口文件
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── routes/          # 路由定义
│   │   ├── middleware/      # 中间件（认证等）
│   │   ├── types/           # TypeScript 类型定义
│   │   └── index.ts         # 入口文件
│   ├── package.json
│   └── tsconfig.json
├── db/                      # 数据库层
│   ├── schema.ts            # Drizzle 表结构定义
│   ├── migrate.ts           # 数据库迁移脚本
│   ├── seed.ts              # 数据填充脚本
│   ├── package.json
│   └── tsconfig.json
├── package.json             # 根配置 & monorepo 脚本
├── tsconfig.json            # 基础 TypeScript 配置
├── .env.example             # 环境变量模板
├── .gitignore               # Git 忽略规则
└── README.md                # 项目文档
```

## API 文档

所有 API 端点以 `/api` 为前缀，需要认证的端点须在请求头中携带 `Authorization: Bearer <token>`。

### 认证相关

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | 否 |
| POST | `/api/auth/login` | 用户登录 | 否 |
| GET | `/api/auth/me` | 获取当前用户信息 | 是 |

### 待办事项

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/todos` | 获取待办列表（支持筛选） | 是 |
| POST | `/api/todos` | 创建待办事项 | 是 |
| PUT | `/api/todos/:id` | 更新待办事项 | 是 |
| DELETE | `/api/todos/:id` | 删除待办事项 | 是 |
| PATCH | `/api/todos/reorder` | 拖拽排序 | 是 |

### 分类管理

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/categories` | 获取分类列表 | 是 |
| POST | `/api/categories` | 创建分类 | 是 |
| DELETE | `/api/categories/:id` | 删除分类 | 是 |

## 开发说明

### 单独启动前端

```bash
npm run dev:frontend
# 或
cd frontend && npm run dev
```

前端开发服务器运行在 http://localhost:5173，已配置 API 代理至后端。

### 单独启动后端

```bash
npm run dev:backend
# 或
cd backend && npm run dev
```

后端服务器运行在 http://localhost:3001，支持热重载。

### 一键安装 + 初始化

```bash
npm run setup
```

此命令将依次执行：安装所有依赖 → 数据库迁移 → 填充示例数据。
