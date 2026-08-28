# useWebSocket 使用说明

## 简介

`useWebSocket` 是一个基于 Vue 3 Composition API 和 TypeScript 的 WebSocket
封装工具，提供了连接管理、自动重连、心跳检测、消息处理等完整功能。

## 核心特性

- ✅ **类型安全** - 完整的 TypeScript 类型支持
- ✅ **自动重连** - 连接断开时自动重试（排除正常关闭）
- ✅ **心跳检测** - 保持连接活跃状态，超时自动断开
- ✅ **消息队列** - 自动管理消息历史记录
- ✅ **事件系统** - 支持自定义事件监听，可取消订阅
- ✅ **内存安全** - 组件卸载时自动清理资源
- ✅ **协议自适应** - 自动根据当前页面协议选择 ws/wss

## WebSocket 代理配置

在开发环境中，可以通过 Vite 配置代理来连接 WebSocket 服务器：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // WebSocket 代理配置
      '/ws': {
        target: 'ws://localhost:8080', // WebSocket 服务器地址
        ws: true, // 启用 WebSocket 代理
        changeOrigin: true, // 修改请求源
      },
    },
  },
})
```

配置代理后，使用相对路径即可：

```typescript
// 使用代理路径
const { isConnected, messages, connect, disconnect, send, on } = useWebSocket('/ws/some-path')
```

## 配置选项

```typescript
interface WebSocketOptions {
  maxReconnectAttempts?: number // 最大重连次数，默认5次
  reconnectInterval?: number // 重连间隔(毫秒)，默认3000ms
  heartbeatInterval?: number // 心跳间隔(毫秒)，默认30000ms，设为0可禁用心跳
  maxMessageHistory?: number // 消息历史记录最大数量，默认100条
}

// 使用示例
const { isConnected, messages, connect, disconnect, send, on } = useWebSocket(
  '/api/websocket', // 相对路径
  {
    maxReconnectAttempts: 3,
    reconnectInterval: 5000,
    heartbeatInterval: 20000,
    maxMessageHistory: 50,
  },
)
```

## API 说明

| 属性/方法             | 类型                                                             | 说明                             |
| --------------------- | ---------------------------------------------------------------- | -------------------------------- |
| `isConnected`         | `Ref<boolean>`                                                   | 响应式变量，表示当前连接状态     |
| `messages`            | `Ref<unknown[]>`                                                 | 响应式数组，存储接收到的消息历史 |
| `connect()`           | `() => void`                                                     | 手动建立连接                     |
| `disconnect()`        | `() => void`                                                     | 手动断开连接                     |
| `send(data)`          | `<T>(data: T) => boolean`                                        | 发送数据，返回发送是否成功       |
| `on(event, callback)` | `<T>(event: string, callback: (data?: T) => void) => () => void` | 事件监听方法，返回取消订阅函数   |

## 支持的事件类型

- `'open'` - 连接建立成功
- `'close'` - 连接关闭
- `'error'` - 连接错误
- `'message'` - 收到消息
- 自定义事件 - 通过 `trigger` 方法触发

## TypeScript 使用示例

### 基础用法

```typescript
<script setup lang="ts">
import { useWebSocket } from '@/websocket'
import { onMounted } from 'vue'

// 初始化WebSocket
const {
  isConnected,
  messages,
  connect,
  disconnect,
  send,
  on
} = useWebSocket('/ws/endpoint')

// 监听连接事件
on('open', () => {
  console.log('WebSocket连接已建立')
})

// 监听消息事件
on('message', (data) => {
  console.log('收到消息:', data)
})

// 监听错误事件
on('error', (error) => {
  console.error('WebSocket错误:', error)
})

// 发送消息
const sendMessage = (content: string) => {
  const success = send(content)
  if (!success) {
    console.warn('消息发送失败')
  }
}

// 发送对象（会自动序列化为 JSON）
const sendObject = () => {
  send({
    type: 'custom',
    data: 'some data',
    timestamp: Date.now()
  })
}

// 组件挂载时连接
onMounted(() => {
  connect()
})
</script>
```

### 高级用法 - 带状态管理

```typescript

<script setup lang="ts">
import { useWebSocket } from '@/websocket'
import { ref, computed, onMounted } from 'vue'

// 状态定义
const connectionStatus = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
const unreadCount = ref(0)

const { isConnected, messages, connect, disconnect, send, on } = useWebSocket('/ws/notifications', {
  maxReconnectAttempts: 3,
  reconnectInterval: 3000,
  heartbeatInterval: 30000
})

// 计算属性
const recentMessages = computed(() =>
  messages.value.slice(-10).reverse()
)

const hasUnread = computed(() => unreadCount.value > 0)

// 事件处理
on('open', () => {
  connectionStatus.value = 'connected'
  console.log('通知服务连接成功')
})

on('message', (data) => {
  if (data) {
    unreadCount.value++
    // 处理接收到的消息
  }
})

on('error', () => {
  connectionStatus.value = 'error'
})

on('close', () => {
  if (connectionStatus.value !== 'error') {
    connectionStatus.value = 'disconnected'
  }
})

// 业务方法
const markAsRead = () => {
  unreadCount.value = 0
}

const reconnect = () => {
  connectionStatus.value = 'connecting'
  connect()
}

onMounted(() => {
  connectionStatus.value = 'connecting'
  connect()
})
</script>

```

## 注意事项

1. **连接时机**：默认采用手动连接模式，需要显式调用 `connect()` 方法
2. **重连策略**：自动重连会排除状态码 1000(正常关闭) 和 1001(正在离开) 的场景
3. **心跳机制**：超过 2 倍心跳间隔未收到 pong 响应会自动断开连接
4. **内存管理**：组件卸载时会自动清理连接和定时器
5. **类型安全**：可根据实际消息格式定义相应的 TypeScript 接口
6. **取消订阅**：`on()` 方法返回取消订阅函数，建议在适当时机调用以避免内存泄漏

## 错误处理

```typescript
// 监听并处理各种错误情况
on('error', (error) => {
  console.error('WebSocket连接错误:', error)
  // 可以在这里添加错误提示或重连逻辑
})

// 检查发送状态
const result = send(message)
if (!result) {
  // 发送失败的处理逻辑
  console.warn('消息发送失败，请检查连接状态')
}

// 使用取消订阅避免内存泄漏
const unsubscribe = on('message', handler)
// 在不需要时取消订阅
unsubscribe()
```

## 最佳实践

1. 在组件 `onMounted` 时建立连接
2. 根据实际业务需求定义消息类型接口
3. 合理设置消息历史记录大小
4. 在适当时候清理未读消息计数
5. 处理网络不稳定时的用户体验
