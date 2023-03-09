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

//分配负责人
export function updateDistributeEmployee(id, query) {
  return request({
    url: '/crm/customers/' + id + '/distribute_employee',
    method: 'PUT',
    data: query
  })
}

// 收货地址信息
export function fetchAddressesList(query) {
  return request({
    url: '/crm/customers/' + query.id + '/addresses',
    method: 'get',
    params: query
  })
}

// 创建收货地址信息
export function createAddress(query) {
  return request({
    url: '/crm/customers/' + query.id + '/new_address',
    method: 'post',
    data: query
  })
}

// 更新收货地址信息
export function updateAddress(id, query) {
  return request({
    url: '/crm/customers/' + id + '/update_address',
    method: 'PUT',
    data: query
  })
}

// 收票地址信息
export function fetchInvoicesList(query) {
  return request({
    url: '/crm/customers/' + query.id + '/invoices',
    method: 'get',
    params: query
  })
}

// 创建收票地址信息
export function createInvoice(id, query) {
  return request({
    url: '/crm/customers/' + id + '/new_invoice',
    method: 'post',
    data: query
  })
}
// 更新收票地址信息
export function updateInvoice(id, query) {
  return request({
    url: '/crm/customers/' + id + '/update_invoice',
    method: 'PUT',
    data: query
  })
}