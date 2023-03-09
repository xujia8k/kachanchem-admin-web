import request from '@/utils/request'
import request_not_intercept from '@/utils/request-not-intercept'


//询盘列表
export function fetchList(query) {
  return request({
    url: '/inquiry/inquiries',
    method: 'get',
    params: query
  })
}

// 创建询盘
export function createInquiries(query) {
  return request({
    url: '/inquiry/inquiries',
    method: 'POST',
    data: query
  })
}

//采购报价详情
export function quotationDetails(query) {
  return request({
    url: '/inquiry/inquiries/' + query.id + '/quotation_details',
    method: 'get',
    params: query
  })
}

//询盘明细信息
export function inquiriesDetails(query) {
  return request({
    url: '/inquiry/inquiries/' + query.id,
    method: 'get',
    params: query
  })
}

// 创建销售订单
export function createCustomerOrder(query) {
  return request({
    url: '/inquiry/inquiry_quotations/create_customer_order',
    method: 'POST',
    data: query
  })
}

//询盘报价列表
export function fetchQuotationsList(query) {
  return request({
    url: '/inquiry/inquiry_quotations',
    method: 'get',
    params: query
  })
}

//询盘报价详情
export function inquiryQuotations(query) {
  return request({
    url: '/inquiry/inquiry_quotations/' + query.id ,
    method: 'get',
    params: query
  })
}
//询盘报价详情
export function quotationsDetails(query) {
  return request({
    url: '/inquiry/inquiry_quotations/' + query.id + '/quotation_details',
    method: 'get',
    params: query
  })
}

// 添加询盘报价
export function addQuotation(query,id) {
  return request({
    url: '/inquiry/inquiry_quotations/' + id + '/new_quotation',
    method: 'POST',
    params: query
  })
}

// 修改采购报价明细
export function updateQuotation(query,id) {
  return request({
    url: '/inquiry/inquiry_quotations/' + id + '/update_quotation',
    method: 'PUT',
    data: query
  })
}
// 修改询盘报价明细
export function updateInquiriesQuotation(query,id) {
  return request({
    url: '/inquiry/inquiries/' + id + '/update_quotation',
    method: 'PUT',
    data: query
  })
}

//历史报价列表
export function quotationHistories(query) {
  return request({
    url: '/inquiry/inquiry_quotations/' + query.id + '/quotation_histories',
    method: 'get',
    params: query
  })
}

// 详情页发送报价
export function sendQuotation(query) {
  return request({
    url: '/inquiry/inquiries/send_quotation',
    method: 'PUT',
    data: query
  })
}

// 列表页发送报价
export function sendQuotation2(query) {
  return request({
    url: '/inquiry/inquiries/send_quotation',
    method: 'PUT',
    data: query
  })
}

// 获取检测费
export function testingFee(query) {
  return request({
    url: '/inquiry/inquiries/testing_fee',
    method: 'get',
    params: query
  })
}
// 更新检测费
export function updateTestingFee(query) {
  return request({
    url: '/inquiry/inquiries/update_testing_fee',
    method: 'PUT',
    data: query
  })
}

// 获取运输报告鉴定费
export function appraisalFee(query) {
  return request({
    url: '/inquiry/inquiries/appraisal_fee',
    method: 'get',
    params: query
  })
}
// 更新运输报告鉴定费
export function updateAppraisalFee(query) {
  return request({
    url: '/inquiry/inquiries/update_appraisal_fee',
    method: 'PUT',
    data: query
  })
}
// 获取汇率
export function exchangeRate(query) {
  return request({
    url: '/inquiry/inquiries/exchange_rate',
    method: 'get',
    params: query
  })
}
// 更新汇率
export function updateExchangeRate(query) {
  return request({
    url: '/inquiry/inquiries/update_exchange_rate',
    method: 'PUT',
    data: query
  })
}

//分配负责人
export function updateDistributeEemployee(id,query) {
  return request({
    url: '/inquiry/inquiries/' + id + '/distribute_employee',
    method: 'PUT',
    data: query
  })
}

//关联客户
export function updateRelateCustomer(id,query) {
  return request({
    url: '/inquiry/inquiries/' + id + '/relate_customer',
    method: 'PUT',
    data: query
  })
}