import createHttp from './create-http'
import { query } from './res'
const pathList = ['/template/insert']
export const templateHandler = [
  ...pathList.map((path) => createHttp(path)),
  createHttp('/template/query', query),
]
