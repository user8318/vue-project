# MSW Mock 使用指南

## 开启/关闭 Mock

在 `.env.development` 文件中设置：

```env
VITE_IS_MOCK=true/false
```

## 添加新接口

### 创建 Handler 模块

在 `src/mocks/` 目录下创建新文件（如 `test-page2.ts`）：

```typescript
import { http, HttpResponse, delay } from 'msw'

const servePath = import.meta.env.VITE_API_TEMPLATE // 接口服务前缀

export const userApiHandlers = [
  // GET 请求示例
  http.get(`${servePath}/users/:id`, async ({ params }) => {
    await delay(300)
    return HttpResponse.json({
      status: 0,
      message: 'Success',
      data: { id: params.id, name: '张三' },
    })
  }),

  // POST 请求示例
  http.post(`${servePath}/users`, async ({ request }) => {
    const body = await request.json()
    await delay(500)
    return HttpResponse.json({
      status: 0,
      message: '创建成功',
      data: { ...body, id: Date.now() },
    })
  }),
]
```

### 注册到主入口

编辑 `src/mocks/index.ts`：

```typescript
import { setupWorker } from 'msw/browser'
import { templateHandler } from './template-handler'
import { templateHandler2 } from './template-handler2' // 新增导入

const handlers = [
  ...templateHandler,
  ...templateHandler2, // 新增注册
]

// ... 其余代码保持不变
```
