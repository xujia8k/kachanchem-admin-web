import request from '@/utils/request'

//获取七牛云token
export function getToken() {
  return request({
    url: '/commons/get_qiniu_token',
    method: 'get'
  })
}

// 上传附件
export function uploadAttachment(query) {
  return request({
    url: '/commons/upload_attachment',
    method: 'get',
    params: query
  })
}

// 获取产品分类
export function fetchClassifyList() {
  return request({
    url: '/commons/product_classify',
    method: 'get'
  })
}
// 获取城市信息
export function fetchCities(query) {
  return request({
    url: '/commons/cities',
    method: 'get',
    params: query
  })
}
// 获取列表
export function fetchDistricts(query) {
  return request({
    url: '/commons/districts',
    method: 'get',
    params: query
  })
}

