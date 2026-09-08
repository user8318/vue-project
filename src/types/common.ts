export interface PageInfo {
  pageSize: number
  pageNum: number
}
export interface BaseButtonProps {
  label?: string
  type?: 'default' | 'tertiary' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'tiny' | 'small' | 'medium' | 'large'
  round?: boolean
  secondary?: boolean
  strong?: boolean
  loading?: boolean
  disabled?: boolean
  url?: string
  data?: Record<string, string | Blob>
  headers?: Record<string, string>
  filename?: string
  showFileList?: boolean
  accept?: string
}
