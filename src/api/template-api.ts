export const query = (data: { id: string }) =>
  request1({
    url: '/template/query',
    method: 'post',
    data,
  })
