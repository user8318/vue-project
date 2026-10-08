export const query = (data: { id: string }) =>
  requestTemplate({
    url: '/template/query',
    method: 'post',
    data,
  })
