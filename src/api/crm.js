import request from '@/utils/request'
import request_not_intercept from '@/utils/request-not-intercept'

export function fetchList(query) {
  return request({
    url: '/crm/leave_words',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/crm/leave_words',
    method: 'POST',
    data: data
  })
}

export function update(query) {
  return request({
    url: '/crm/leave_words/' + query.id,
    method: 'PUT',
    data: query
  })
}

//客户信息列表
export function getCustomers(query) {
  return request({
    url: '/crm/customers',
    method: 'get',
    params: query
  })
}

//创建客户信息
export function postCustomers(data) {
  return request({
    url: '/crm/customers',
    method: 'POST',
    data: data
  })
}

// 更新客户信息
export function putCustomers(query) {
  return request({
    url: '/crm/customers/' + query.id,
    method: 'PUT',
    data: query
  })
}


// 删除客户信息
export function destroyCustomers(query) {
  return request({
    url: '/crm/customers/' + query.id,
    method: 'DELETE',
    data: query
  })
}
