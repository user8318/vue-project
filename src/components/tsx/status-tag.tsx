const processStatusTagProps = {
  1: { text: '未开始', type: 'default' },
  2: { text: '进行中', type: 'info' },
  3: { text: '已完成', type: 'success' },
} as const
export const ProcessStatusTag = (status: number) => {
  const { text, type } = processStatusTagProps[(status as keyof typeof processStatusTagProps) ?? 1]
  return <n-tag type={type}>{text}</n-tag>
}
