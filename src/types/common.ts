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
  url?: string
  data?: Record<string, string | Blob>
  filename?: string
  showFileList?: boolean
}
