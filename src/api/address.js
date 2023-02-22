import request from '@/utils/request'

// 获取省份信息
export function fetchProvinces() {
  return request({
    url: '/commons/provinces',
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
