interface UseModalSyncReturn<T> {
  /** 模态框 after-enter 时调用 */
  onEnter: () => void
  /** 异步数据返回时调用 */
  resolve: (data: T) => void
  /** 打开模态框前调用，重置状态 */
  reset: () => void
}
/**
 * 协调"模态框展开动画"与"异步数据返回"两个异步事件，
 * 确保两者都就绪后才执行 callback。
 */
export function useModalSync<T>(callback: (data: T) => void): UseModalSyncReturn<T> {
  const isEntered = ref(false)
  const pendingData = ref<T | null>(null)
  const onEnter = () => {
    isEntered.value = true
    if (pendingData.value !== null) {
      callback(pendingData.value)
      pendingData.value = null
    }
  }
  const resolve = (data: T) => {
    if (isEntered.value) {
      callback(data)
    } else {
      pendingData.value = data
    }
  }
  const reset = () => {
    isEntered.value = false
    pendingData.value = null
  }
  return { onEnter, resolve, reset }
}
