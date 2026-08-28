import axios from 'axios'
export const downloadFile = async (
  url: string,
  data: unknown = {},
  filename?: string,
  headers?: object,
) => {
  try {
    const res = await axios({
      url,
      method: 'post',
      data,
      responseType: 'blob',
      headers,
    })
    const blob = new Blob([res.data])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename || 'download'
    link.click()
    URL.revokeObjectURL(link.href)
  } catch {
    nMessage.error('下载失败')
  }
}
