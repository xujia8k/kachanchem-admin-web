import request from '@/utils/request'
//客户信息搜索
export function searchCustomer(query) {
  return request({
    url: '/searchs/customers',
    method: 'get',
    params: query
  })
}
//化学品信息搜索
export function chemicalsList(query) {
  return request({
    url: '/searchs/chemicals',
    method: 'get',
    params: query
  })
}

//客户信息搜索
export function searchUser(query) {
  return request({
    url: '/searchs/companies',
    method: 'get',
    params: query
  })
}

//供应商信息搜索
export function vendorList(query) {
  return request({
    url: '/searchs/vendor_companies',
    method: 'get',
    params: query
  })
}


//产品信息搜索
export function productsList(query) {
  return request({
    url: '/searchs/products',
    method: 'get',
    params: query
  })
}

//公司联系人信息搜索
export function contactsList(query) {
  return request({
    url: '/searchs/contacts',
    method: 'get',
    params: query
  })
}

//收付款账户信息搜索
export function accountsList(query) {
  return request({
    url: '/searchs/finance_accounts',
    method: 'get',
    params: query
  })
}


//收货地址信息搜索
export function addressesList(query) {
  return request({
    url: '/searchs/addresses',
    method: 'get',
    params: query
  })
}
