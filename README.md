# TakeoutByNext

基于 Next.js + TypeScript + Tailwind CSS + Ant Design 构建的外卖管理系统前端脚手架。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Ant Design
- **状态管理**: Zustand
- **数据请求**: TanStack Query (React Query) + Axios
- **图表**: ECharts / Recharts

## 项目结构

```
takeoutbynext/
├── src/
│   ├── app/              # Next.js App Router 路由页面
│   ├── components/       # 公共组件
│   ├── hooks/            # 自定义 React Hooks
│   ├── services/         # API 请求服务
│   ├── stores/           # Zustand 状态管理
│   ├── styles/           # 全局样式
│   ├── types/            # TypeScript 类型定义
│   └── utils/            # 工具函数
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
├── next.config.js        # Next.js 配置
├── tailwind.config.ts    # Tailwind CSS 配置
├── postcss.config.js     # PostCSS 配置
├── .eslintrc.json        # ESLint 配置
└── .env.example          # 环境变量示例
```

## 快速开始

### 1. 安装依赖

```bash
cd takeoutbynext
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

根据需要修改 `.env.local` 中的配置。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 脚本说明

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run type-check` - 运行 TypeScript 类型检查
