import request from '@/utils/request'

// 获取列表
export function fetchList(query) {
  return request({
    url: '/hr/employees',
    method: 'get',
    params: query
  })
}

// 通过搜索获取列表
export function fetchHRList(query) {
  return request({
    url: '/hr/employees',
    method: 'get',
    params: query
  })
}
// 获取员工所属角色信息
export function updateEmployeesRole(query) {
  return request({
    url: '/hr/employees/' + query.id + '/role',
    method: 'GET'
  })
}
export function fetchRolesList(query) {
  return request({
    url: '/hr/roles',
    method: 'get',
    params: query
  })
}
// 获取角色权限列表
export function fetchPermissionList(query) {
  return request({
    url: '/hr/roles/' + query.id + '/permission',
    method: 'get'
  })
}
// 获取拥有对应角色的员工列表
export function fetchEmployeeList(query) {
  return request({
    url: '/hr/roles/' + query.id + '/employee',
    method: 'get'
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

// 分配角色
export function updateRole(roleId, query) {
  return request({
    url: '/hr/employees/' + roleId + '/update_role',
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
// 更新角色权限信息
export function updatePermission(roleId, query) {
  return request({
    url: '/hr/roles/' + roleId + '/update_permission',
    method: 'PUT',
    data: query
  })
}

export function pagePermission(query) {
  return request({
    url: '/hr/roles/' + query.id + '/page_permission',
    method: 'get',
    params: query
  })
}
// 更新角色查看他人单据信息
export function updatePagePermission(roleId, query) {
  return request({
    url: '/hr/roles/' + roleId + '/update_page_permission',
    method: 'PUT',
    data: query
  })
}


