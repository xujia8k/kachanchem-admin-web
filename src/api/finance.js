import request from '@/utils/request'

//收付款账户列表
export function financeAccounts(query) {
  return request({
    url: '/finance/finance_accounts',
    method: 'get',
    params: query
  })
}

// 添加收付款账户
export function createFinanceAccounts(query) {
  return request({
    url: '/finance/finance_accounts',
    method: 'POST',
    data: query
  })
}

// 修改询盘报价明细
export function updateFinanceAccounts(query) {
  return request({
    url: '/finance/finance_accounts/' + query.id,
    method: 'PUT',
    data: query
  })
}

//收款单列表
export function financeReceipts(query) {
  return request({
    url: '/finance/finance_receipts',
    method: 'get',
    params: query
  })
}

// 修改收款单明细
export function updateFinanceReceipts(query) {
  return request({
    url: '/finance/finance_receipts/update_detail_info',
    method: 'PUT',
    data: query
  })
}

// 审核收款单明细
export function updateFinanceReceiptsApprove(query) {
  return request({
    url: '/finance/finance_receipts/approve',
    method: 'PUT',
    data: query
  })
}

// 创建销项发票
export function createFinanceBill(query) {
  return request({
    url: '/finance/finance_receipts/create_finance_bill',
    method: 'POST',
    data: query
  })
}

//付款单列表
export function financePayments(query) {
  return request({
    url: '/finance/finance_payments',
    method: 'get',
    params: query
  })
}

// 付款
export function updateFinancePayments(query) {
  return request({
    url: '/finance/finance_payments/'+query.id+'/pay',
    method: 'PUT',
    data: query
  })
}

// 确认收票
export function createFinancePayments(query) {
  return request({
    url: '/finance/finance_payments/'+query.id+'/create_finance_invoice',
    method: 'POST',
    data: query
  })
}


//销项发票
export function financeBills(query) {
  return request({
    url: '/finance/finance_bills',
    method: 'get',
    params: query
  })
}

// 录入快递信息
export function updateCourierNum(query) {
  return request({
    url: '/finance/finance_bills/'+query.id+'/update_courier_num',
    method: 'PUT',
    data: query
  })
}

//进项发票
export function financeInvoices(query) {
  return request({
    url: '/finance/finance_invoices',
    method: 'get',
    params: query
  })
}
//创建进项发票
export function createFinanceInvoices(query) {
  return request({
    url: '/finance/finance_invoices',
    method: 'post',
    data: query
  })
}

// 取消收票
export function cancelFinanceInvoices(query) {
  return request({
    url: '/finance/finance_invoices/'+query.id+'/cancel',
    method: 'PUT',
    data: query
  })
}

// 核销发票
export function checkFinanceInvoices(query) {
  return request({
    url: '/finance/finance_invoices/'+query.id+'/check',
    method: 'PUT',
    data: query
  })
}

// 待核销付款单列表
export function uncheckFinancePayments(query) {
  return request({
    url: '/finance/finance_invoices/'+query.id+'/uncheck_finance_payments',
    method: 'get',
    params: query
  })
}


//更新销项发票信息
export function updateFinanceBills(query) {
  return request({
    url: '/finance/finance_bills/' + query.id,
    method: 'PUT',
    data: query
  })
}

//确认开票
export function checkFinanceBills(query) {
  return request({
    url: '/finance/finance_bills/' + query.id + '/check',
    method: 'PUT',
    data: query
  })
}

//取消开票
export function cancelFinanceBills(query) {
  return request({
    url: '/finance/finance_bills/' + query.id + '/cancel',
    method: 'PUT',
    data: query
  })
}


// 申请付款单列表
export function financePaymentApplications(query) {
  return request({
    url: '/finance/finance_payment_applications',
    method: 'get',
    params: query
  })
}

// 审核申请信息
export function checkFinancePaymentApplications(query) {
  return request({
    url: '/finance/finance_payment_applications/' + query.id,
    method: 'PUT',
    data: query
  })
}