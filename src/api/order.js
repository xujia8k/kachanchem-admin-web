import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/customer_order/customer_orders',
    method: 'get',
    params: query
  })
}
