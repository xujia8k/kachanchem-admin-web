import request from '@/utils/request'

// 关联采购订单附件
export function PO_relate_attachment(id,query) {
  return request({
    url: '/purchase/orders/' + id + '/relate_attachment',
    method: 'PUT',
    data: query
  })
}

// 删除采购订单附件
export function PO_delete_attachment(id,query) {
  return request({
    url: '/purchase/orders/' + id + '/delete_attachment',
    method: 'PUT',
    data: query
  })
}

// 关联付款单附件
export function FP_relate_attachment(id,query) {
  return request({
    url: '/finance/finance_payments/' + id + '/relate_attachment',
    method: 'PUT',
    data: query
  })
}

// 删除付款单附件
export function FP_delete_attachment(id,query) {
  return request({
    url: '/finance/finance_payments/' + id + '/delete_attachment',
    method: 'PUT',
    data: query
  })
}
