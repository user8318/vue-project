import { http, HttpResponse, delay } from 'msw'
const servePath = import.meta.env.VITE_API_TEMPLATE
export default (path: string, res?: unknown) => {
  return http.post(`${servePath}${path}`, async () => {
    await delay(500)
    return HttpResponse.json(
      res || {
        status: 0,
        message: 'Success',
        data: null,
      },
    )
  })
}
