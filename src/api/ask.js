import request from '@/utils/request'

// 获取列表
export function fetchList(query) {
  return request({
    url: '/hr/employees',
    method: 'get',
    params: query
  })
}
export function fetchRolesList(query) {
  return request({
    url: '/hr/roles',
    method: 'get',
    params: query
  })
}

// 创建
export function create(data) {
  return request({
    url: '/hr/employees',
    method: 'POST',
    data: data
  })
}
export function createRoles(data) {
  return request({
    url: '/hr/roles',
    method: 'POST',
    data: data
  })
}
// 更新
export function update(query) {
  return request({
    url: '/hr/employees/' + query.id,
    method: 'PUT',
    data: query
  })
}
export function updateRoles(query) {
  return request({
    url: '/hr/roles/' + query.id,
    method: 'PUT',
    data: query
  })
}

