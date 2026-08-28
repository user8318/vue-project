import { setupWorker } from 'msw/browser'
import { templateHandler } from './template-handler'
// MSW 代理 XHR headers 时会尝试 setRequestHeader('cookie')，浏览器拒绝此操作并抛错。
// XHR 的 cookie 由浏览器自动管理，手动设置本就无效，故静默忽略。
const _origSetHeader = XMLHttpRequest.prototype.setRequestHeader
XMLHttpRequest.prototype.setRequestHeader = function (n, v) {
  return String(n).toLowerCase() === 'cookie' ? undefined : _origSetHeader.call(this, n, v)
}
const handlers = [...templateHandler]
const isMock = () =>
  import.meta.env.MODE === 'development' && import.meta.env.VITE_IS_MOCK === 'true'
export const useMock = async () => {
  if (!isMock()) {
    return
  }
  const worker = setupWorker(...handlers)
  worker.events.on('request:match', async ({ request }) => {
    const body = await request
      .clone()
      .json()
      .catch(() => null)
    const { headers, method, url } = request
    const nUrl = new URL(url)
    const { pathname, search, searchParams } = nUrl
    const searchParamsObj = Object.fromEntries(searchParams.entries())
    console.log('%c[MSW] request\n', 'color: #70c0e8', `${pathname}${search}\n`, {
      body,
      headers: Object.fromEntries(headers.entries()),
      method,
      searchParams: searchParamsObj,
      url: nUrl,
    })
  })
  worker.events.on('response:mocked', async ({ response }) => {
    const body = await response
      .clone()
      .json()
      .catch(() => null)
    const { headers, url, status } = response
    const nUrl = new URL(url)
    const { pathname, search } = nUrl
    const statusColor = status >= 400 ? '#e88080' : status >= 300 ? '#f2c97d' : '#63e2b7'
    console.log('%c[MSW] response\n', `color: ${statusColor}`, `${pathname}${search}\n`, {
      body,
      headers: Object.fromEntries(headers.entries()),
      status,
      url: nUrl,
    })
  })
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
}
