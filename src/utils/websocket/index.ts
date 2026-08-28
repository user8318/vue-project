import type { Ref } from 'vue'

/**
 * WebSocket配置选项接口
 */
interface WebSocketOptions {
  /** 最大重连尝试次数，默认5次 */
  maxReconnectAttempts?: number
  /** 重连间隔时间(毫秒)，默认3000ms */
  reconnectInterval?: number
  /** 心跳检测间隔(毫秒)，默认30000ms，设为0或负数可禁用心跳 */
  heartbeatInterval?: number
  /** 消息历史记录最大数量，默认100条 */
  maxMessageHistory?: number
}

/**
 * WebSocket回调函数类型定义
 */
type WebSocketCallback<T = unknown> = (data?: T) => void

// WebSocket关闭状态码常量
const NORMAL_CLOSURE = 1000
const GOING_AWAY = 1001

export const useWebSocket = (url: string, options: WebSocketOptions = {}) => {
  // 配置初始化 - 合并默认值和用户配置
  const config = {
    maxReconnectAttempts: 5,
    reconnectInterval: 3000,
    heartbeatInterval: 30000,
    maxMessageHistory: 100,
    ...options,
  }

  // 状态管理 - 响应式数据
  const ws: Ref<WebSocket | null> = ref(null) // WebSocket实例引用
  const isConnected = ref(false) // 连接状态
  const messages = ref<unknown[]>([]) // 消息历史记录
  const callbacks = new Map<string, WebSocketCallback[]>() // 事件回调存储

  // 内部变量 - 控制连接行为
  let timer: ReturnType<typeof setTimeout> | null = null // 定时器引用(心跳/重连)
  let shouldStop = false // 是否应该停止连接
  let attempts = 0 // 重连尝试次数
  let lastPongTime = Date.now() // 最后一次收到pong的时间

  /**
   * 清理定时器
   */
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  /**
   * 重置连接状态
   */
  const resetConnectionState = () => {
    isConnected.value = false
    attempts = 0
  }

  /**
   * 触发事件回调 - 安全地执行注册的回调函数
   * @param event - 事件名称
   * @param data - 传递给回调的数据
   */
  const trigger = <T = unknown>(event: string, data?: T) => {
    if (!shouldStop) {
      callbacks.get(event)?.forEach((cb) => {
        try {
          cb(data)
        } catch (error) {
          console.error(`WebSocket 事件回调错误 (${event}):`, error)
        }
      })
    }
  }

  /**
   * 获取WebSocket URL
   * @param url - WebSocket路径或完整URL
   */
  const getWebSocketUrl = (url: string): string => {
    if (url.startsWith('ws://') || url.startsWith('wss://')) {
      return url
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}${url.startsWith('/') ? url : '/' + url}`
  }

  /**
   * 建立WebSocket连接 - 核心连接逻辑
   */
  const connect = () => {
    // 防止在组件销毁后建立连接
    if (shouldStop) return

    // 关闭现有连接
    ws.value?.close()

    try {
      // 创建新的WebSocket连接
      ws.value = new WebSocket(getWebSocketUrl(url))
    } catch (error) {
      console.error('WebSocket 创建失败:', error)
      trigger('error', error)
      return
    }

    // 连接成功事件处理
    ws.value.onopen = () => {
      console.log('WebSocket 连接成功')
      isConnected.value = true
      attempts = 0 // 重置重连计数器
      lastPongTime = Date.now() // 重置心跳时间

      // 启动心跳检测(如果配置了间隔时间)
      if (config.heartbeatInterval > 0) {
        timer = setInterval(() => {
          // 检查心跳超时
          if (Date.now() - lastPongTime > config.heartbeatInterval * 2) {
            console.warn('WebSocket: 心跳超时，关闭连接')
            ws.value?.close()
            return
          }

          if (ws.value?.readyState === WebSocket.OPEN) {
            try {
              ws.value.send('ping')
            } catch {
              // 心跳发送失败，通常可以忽略
            }
          }
        }, config.heartbeatInterval)
      }

      // 发送首次ping确认连接
      try {
        ws.value!.send('ping')
      } catch {
        // 首次ping失败，通常可以忽略
      }

      trigger('open')
    }

    // 消息接收事件处理
    ws.value.onmessage = (event: MessageEvent) => {
      // 组件已销毁时不处理消息
      if (shouldStop) return

      // 更新心跳时间并忽略心跳响应消息
      if (event.data === 'pong') {
        lastPongTime = Date.now()
        return
      }

      // 解析消息数据
      const data = (() => {
        try {
          return JSON.parse(event.data as string)
        } catch {
          // JSON解析失败时返回原始数据
          return { raw: event.data }
        }
      })()

      // 维护消息历史记录大小
      if (messages.value.length >= config.maxMessageHistory) {
        messages.value.shift()
      }

      // 添加新消息到历史记录
      messages.value.push(data)
      trigger('message', data)
    }

    // 错误事件处理
    ws.value.onerror = (event: Event) => {
      console.error('WebSocket 错误:', event)
      clearTimer()
      resetConnectionState()
      trigger('error', event)
    }

    // 连接关闭事件处理
    ws.value.onclose = (event: CloseEvent) => {
      console.log('WebSocket 连接关闭')
      clearTimer()
      resetConnectionState()
      trigger('close', event)

      // 自动重连逻辑 - 仅对异常关闭进行重连
      if (
        !shouldStop && // 组件未销毁
        ![NORMAL_CLOSURE, GOING_AWAY].includes(event.code) && // 排除正常关闭和离开
        attempts < config.maxReconnectAttempts // 未达到最大重连次数
      ) {
        attempts++
        console.log(`准备重连... (${attempts}/${config.maxReconnectAttempts})`)

        // 安排重连
        timer = setTimeout(() => {
          if (!shouldStop) {
            connect()
          }
        }, config.reconnectInterval)
      }
    }
  }

  /**
   * 主动断开连接
   */
  const disconnect = () => {
    shouldStop = true
    clearTimer()
    resetConnectionState()

    if (ws.value) {
      ws.value.close(NORMAL_CLOSURE, '主动断开')
      ws.value = null
    }
  }

  /**
   * 发送消息到WebSocket服务器
   * @param data - 要发送的数据
   * @returns 发送是否成功
   */
  const send = <T = unknown>(data: T): boolean => {
    // 检查连接状态和数据有效性
    if (shouldStop || data == null) {
      console.warn(data == null ? 'WebSocket: 尝试发送空数据' : 'WebSocket已停止')
      return false
    }

    // 检查WebSocket连接状态
    if (ws.value?.readyState === WebSocket.OPEN) {
      try {
        // 序列化对象数据
        const msg = typeof data === 'object' ? JSON.stringify(data) : String(data)

        ws.value.send(msg)
        return true
      } catch (error) {
        console.error('WebSocket 消息发送失败:', error)
      }
    }

    console.warn('WebSocket: 连接未就绪，无法发送消息')
    return false
  }

  /**
   * 注册事件监听器
   * @param event - 事件名称 ('open'|'close'|'error'|'message')
   * @param callback - 回调函数
   * @returns 取消订阅函数
   */
  const on = <T = unknown>(event: string, callback: WebSocketCallback<T>) => {
    // 参数验证
    if (shouldStop || !event) {
      console.warn('WebSocket: 事件名必须是字符串')
      return () => {}
    }

    // 初始化事件回调数组
    if (!callbacks.has(event)) {
      callbacks.set(event, [])
    }

    const cbs = callbacks.get(event)!

    // 类型检查并注册回调
    if (typeof callback === 'function') {
      cbs.push(callback as WebSocketCallback<unknown>)
    } else {
      console.warn('WebSocket: 回调不是函数')
    }

    // 返回取消订阅函数
    return () => {
      const index = cbs.indexOf(callback as WebSocketCallback<unknown>)
      if (index > -1) {
        cbs.splice(index, 1)
      }
    }
  }

  // 组件卸载时自动清理资源
  onUnmounted(disconnect)

  // 返回公共API
  return {
    isConnected, // 连接状态(响应式)
    messages, // 消息历史记录(响应式)
    connect, // 建立连接方法
    disconnect, // 断开连接方法
    send, // 发送消息方法
    on, // 事件监听方法
  }
}
