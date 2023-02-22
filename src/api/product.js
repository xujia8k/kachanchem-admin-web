import request from '@/utils/request'

// 获取列表
export function fetchList(query) {
  return request({
    url: '/product/products',
    method: 'get',
    params: query
  })
}
// 获取产品分类
export function classifyList(query) {
  return request({
    url: '/product/products/classify',
    method: 'get',
    params: query
  })
}
// 更新产品分类
export function updateClassify(query) {
  return request({
    url: '/product/products/update_classify',
    method: 'PUT',
    data: query
  })
}
// 创建
export function create(data) {
  return request({
    url: '/product/products',
    method: 'POST',
    data: data
  })
}
// 更新
export function updateGoods(query) {
  return request({
    url: '/product/products/' + query.id,
    method: 'PUT',
    data: query
  })
}
// 删除
export function deleteGoods(query) {
  return request({
    url: '/product/products/' + query.id,
    method: 'DELETE',
    data: query
  })
}

// 产品历史报价列表
export function fetchQuotationHistoriesList(query) {
  return request({
    url: '/product/products/' + query.id +'/quotation_histories',
    method: 'get',
    params: query
  })
}
// 获取优势产品列表
export function fetchAdvantageProductsList(query) {
  return request({
    url: '/product/advantage_products',
    method: 'get',
    params: query
  })
}
// 创建优势产品
export function createAdvantageProducts(data) {
  return request({
    url: '/product/advantage_products',
    method: 'POST',
    data: data
  })
}
// 更新优势产品
export function updateAdvantageProducts(query) {
  return request({
    url: '/product/advantage_products/' + query.id,
    method: 'PUT',
    data: query
  })
}
// 删除优势产品
export function deleteAdvantageProducts(query) {
  return request({
    url: '/product/advantage_products/' + query.id,
    method: 'DELETE',
    data: query
  })
}
