import type { Ref } from 'vue'
export const useLoading = (loadingRef: Ref<boolean>) => {
  return <T extends unknown[], R>(callback: (...args: T) => Promise<R>) =>
    async (...args: T): Promise<R> => {
      loadingRef.value = true
      nLoadingBar.start()
      try {
        const result = await callback(...args)
        nLoadingBar.finish()
        return result
      } catch (error) {
        nLoadingBar.error()
        throw error
      } finally {
        loadingRef.value = false
      }
    }
}
