import request from '@/utils/request'

// 获取列表
export function fetchList(query) {
  return request({
    url: '/front_end/banners',
    method: 'get',
    params: query
  })
}
// 创建
export function create(data) {
  return request({
    url: '/front_end/banners',
    method: 'POST',
    data: data
  })
}
// 更新
export function update(query) {
  return request({
    url: '/front_end/banners/' + query.id,
    method: 'PUT',
    data: query
  })
}
// 删除
export function destroyBanners(query) {
  return request({
    url: '/front_end/banners/' + query.id,
    method: 'DELETE',
    data: query
  })
}

// 获取列表
export function fetchLogisticsInfos(query) {
  return request({
    url: '/front_end/logistics_infos',
    method: 'get',
    params: query
  })
}
// 创建
export function createLogisticsInfos(data) {
  return request({
    url: '/front_end/logistics_infos',
    method: 'POST',
    data: data
  })
}
// 更新
export function updateLogisticsInfos(query) {
  return request({
    url: '/front_end/logistics_infos/' + query.id,
    method: 'PUT',
    data: query
  })
}
// 删除
export function destroyLogisticsInfos(query) {
  return request({
    url: '/front_end/logistics_infos/' + query.id,
    method: 'DELETE',
    data: query
  })
}

// 获取前台公司信息列表
export function fetchIntroductionsList(query) {
  return request({
    url: '/front_end/introductions',
    method: 'get',
    params: query
  })
}
// 创建前台公司信息
export function createIntroductions(data) {
  return request({
    url: '/front_end/introductions',
    method: 'POST',
    data: data
  })
}
// 更新前台公司信息
export function updateIntroductions(query) {
  return request({
    url: '/front_end/introductions/' + query.id,
    method: 'PUT',
    data: query
  })
}
// 删除前台公司信息
export function destroyIntroductions(query) {
  return request({
    url: '/front_end/introductions/' + query.id,
    method: 'DELETE',
    data: query
  })
}


// 获取公司简介
export function fetchCompanyIntroductionList(query) {
  return request({
    url: '/front_end/introductions/company_introduction',
    method: 'get',
    params: query
  })
}
// 更新前台公司简介
export function updateCompanyIntroduction(query) {
  return request({
    url: '/front_end/introductions/update_company_introduction',
    method: 'PUT',
    data: query
  })
}