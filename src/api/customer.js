import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/customer/orders',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/customer/orders',
    method: 'POST',
    data: data
  })
}
// 客户订单详情
export function fetchDetails(query) {
  return request({
    url: '/customer/orders/' + query,
    method: 'get'
  })
}

//取消客户订单
export function cancelOrder(id) {
  return request({
    url: '/customer/orders/' + id + '/cancel',
    method: 'PUT'
  })
}

//创建收款单明细
export function createFinanceReceiptDetail(query) {
  return request({
    url: '/customer/orders/' + query.id + '/create_finance_receipt_detail',
    method: 'POST',
    data: query
  })
}
// 收款单明细列表
export function financeReceiptDetails(query) {
  return request({
    url: '/customer/orders/' + query.id + '/finance_receipt_details',
    method: 'get',
    params: query
  })
}

//销售订单-- 录入物流信息
export function createCustomerLogisticsInfo(query) {
  return request({
    url: '/customer/orders/'+ query.id + '/create_logistics_info',
    method: 'POST',
    data: query
  })
}

//获取录入物流信息
export function getLogisticsInfo(id) {
  return request({
    url: '/customer/orders/' + id + '/get_logistics_info',
    method: 'get'
  })
}

//删除物流信息
export function deleteLogisticsInfo(query) {
  return request({
    url: '/customer/orders/' + query.id + '/delete_logistics_info',
    method: 'DELETE',
    data: query
  })
}

// 关注订单(认证)
export function follow(query) {
  return request({
    url: '/customer/orders/' + query.id + '/follow',
    method: 'POST'
  })
}

// 取消关注订单(认证)
export function unfollow(query) {
  return request({
    url: '/customer/orders/' + query.id + '/unfollow',
    method: 'POST'
  })
}