import axios, { type AxiosError } from 'axios'
export interface HandledError {
  __handled?: boolean
}
export interface ServiceError extends AxiosError, HandledError {}
export const createService = (baseURL: string) => {
  const service = axios.create({ baseURL })
  service.interceptors.response.use(
    (res) => res,
    (err: ServiceError) => {
      if (err.__handled) return Promise.reject(err)
      nMessage.error(err.message)
      err.__handled = true
      return Promise.reject(err)
    },
  )
  return service
}
