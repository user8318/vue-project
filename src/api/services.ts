import { createService } from '@/utils/service'
const createServiceTemplate = (baseURL: string) => {
  const service = createService(baseURL)
  return service
}
export const requestTemplate = createServiceTemplate(import.meta.env.VITE_API_TEMPLATE)
