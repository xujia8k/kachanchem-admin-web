import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/customer_order/customer_orders',
    method: 'get',
    params: query
  })
}
export function updateReceivedAmount(query) {
  return request({
    url: '/customer_order/customer_orders/' + query.id +'/received_amount',
    method: 'put',
    data: query
  })
}
