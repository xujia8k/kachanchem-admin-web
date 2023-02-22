import request from '@/utils/request'

//获取用户信息
export function mallUsers(query) {
  return request({
    url: '/mall/users',
    method: 'get',
    params: query
  })
}

//修改用户信息
export function updateMallUsers(query) {
  return request({
    url: '/mall/users/'+query.id,
    method: 'PUT',
    data: query
  })
}

//获取地址信息
export function mallUsersAddresses(query) {
  return request({
    url: '/mall/users/'+query.id+'/addresses',
    method: 'get',
    params: query
  })
}

// 创建收货地址信息
export function createAddress(query) {
  return request({
    url: '/mall/users/' + query.id + '/new_address',
    method: 'post',
    data: query
  })
}

// 更新收货地址信息
export function updateAddress(id, query) {
  return request({
    url: '/mall/users/' + id + '/update_address',
    method: 'PUT',
    data: query
  })
}

// 收票地址信息
export function fetchInvoicesList(query) {
  return request({
    url: '/mall/users/' + query.id + '/invoices',
    method: 'get',
    params: query
  })
}

// 创建收票地址信息
export function createInvoice(id, query) {
  return request({
    url: '/mall/users/' + id + '/new_invoice',
    method: 'post',
    data: query
  })
}
// 更新收票地址信息
export function updateInvoice(id, query) {
  return request({
    url: '/mall/users/' + id + '/update_invoice',
    method: 'PUT',
    data: query
  })
}

//销售订单
export function mallOrders(query) {
  return request({
    url: '/mall/orders',
    method: 'get',
    params: query
  })
}


//客户订单详情
export function fetchDetails(query) {
  return request({
    url: '/mall/orders/' + query +'/detail',
    method: 'get'
  })
}

// 获得产品列表
export function getChemicals(query) {
  return request({
    url: '/mall/chemicals',
    method: 'get',
    params: query
  })
}
// 创建产品列表
export function createChemicals(query) {
  return request({
    url: '/mall/chemicals',
    method: 'post',
    data: query
  })
}

// 更新产品列表
export function updateChemicals(query) {
  return request({
    url: '/mall/chemicals/' + query.id,
    method: 'put',
    data: query
  })
}

// 更新产品规格信息
export function updateChemicalsSpec(query) {
  return request({
    url: '/mall/chemicals/spec',
    method: 'put',
    data: query
  })
}


// 活动商品列表
export function getChemicalsHot(query) {
  return request({
    url: '/mall/chemicals/hot',
    method: 'get',
    params: query
  })
}

// 支付记录列表
export function getPaymentList(query) {
  return request({
    url: '/mall/payment',
    method: 'get',
    params: query
  })
}

// 获取供应商列表
export function getSupplierList(query) {
  return request({
    url: '/mall/supplier',
    method: 'get',
    params: query
  })
}


// 修改供应商列表
export function updateSupplier(query) {
  return request({
    url: '/mall/supplier/' + query.id,
    method: 'put',
    data: query
  })
}
