# vue-project

## 🚀 技术栈

- **框架**：[Vue](https://cn.vuejs.org/)，[TypeScript](https://www.typescriptlang.org/)
- **构建**：[Vite](https://cn.vitejs.dev/)
- **路由**：[Vue Router](https://router.vuejs.org/)
- **样式**：[Tailwind CSS](https://tailwindcss.com/)
- **UI组件**：[Naive UI](https://www.naiveui.com/)，[xicons](https://xicons.org/)(ionicons5)
- **HTTP**：[Axios](https://axios-http.com/)
- **Mock**：[MSW](https://msw.nodejs.cn/)
- **图表**：[ECharts](https://echarts.apache.org/)
- **状态管理**：[Pinia](https://pinia.vuejs.org/)（已安装，当前未启用）

## 📁 项目结构

```text
src/
├── api/          # 接口定义
├── components/   # 公共组件
├── images/       # 图片资源
├── mocks/        # Mock数据
├── router/       # 路由配置
├── styles/       # 全局样式
├── types/        # 全局 TS 类型
├── utils/        # 工具函数
│   ├── auto-import/  # 自动导入的 composables / utilities
│   ├── service.ts    # Axios 封装
│   └── websocket/    # WebSocket 封装
├── views/        # 页面组件
└── main.ts       # 应用入口
```

## 🔄 自动导入

项目配置了 Vite 插件实现自动导入，减少样板代码：

- **[unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)**：自动导入 Vue API、vue-router API、`@vueuse/core` composables，以及 `src/utils/auto-import/`、`src/components/tsx/`、`src/api/services.ts` 中的项目工具。
- **[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)**：自动导入 `src/components/` 下的组件和 naive-ui 组件。

相关配置与声明文件：

- [vite.config.ts](vite.config.ts) — 自动导入插件配置
- [auto-import.d.ts](auto-import.d.ts) — 自动导入 API 的类型声明
- [vue-components.d.ts](vue-components.d.ts) — 自动导入组件的类型声明

## ⚙️ 环境变量配置

[.env.development](.env.development)

[.env.production](.env.production)

```env
# 网关地址 - 所有API请求的统一入口
VITE_GATEWAY=http://192.168.3.1:9000

# API服务前缀 - HTTP接口的基础路径
VITE_API_TEMPLATE=/api

# WebSocket服务前缀 - WebSocket连接的基础路径
VITE_WS_TEMPLATE=/ws

# Mock开关 - 开发环境是否启用Mock数据
VITE_IS_MOCK=false
```

## 🌐 API 服务

- 自动请求拦截和响应处理
- 统一错误提示
- Token 自动注入
- 开发代理配置

[service.ts](src/utils/service.ts)

## 🔄 WebSocket

- 心跳检测
- 自动重连机制
- 消息历史记录
- 事件驱动API

[src/utils/websocket/WEBSOCKET_USAGE.md](src/utils/websocket/WEBSOCKET_USAGE.md)

## 🎭 Mock 数据

[.env.development](.env.development)

```env
VITE_IS_MOCK=true
```

- 基于 MSW 的真实网络拦截
- 开发环境无缝切换

[src/mocks/MOCK_USAGE.md](src/mocks/MOCK_USAGE.md)

## 🎨 UI 组件

- [Naive UI](https://www.naiveui.com/)（离散 API 在 [src/utils/auto-import/use-naive-ui.ts](src/utils/auto-import/use-naive-ui.ts) 中初始化）
- [xicons](https://xicons.org/#/)(ionicons5)

```typescript
import { Accessibility } from '@vicons/ionicons5'
```
