// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'
/**
 * 状态判断
 * @param {String} string
 */
export function statusFilter(string) {
  const statusMap = ['否', '是']
  return statusMap[string]
}
/**
 * 监管条件
 * @param {String} string
 */
export function isTtakeChargeFilter(string) {
  const statusMap = ['无', '有']
  return statusMap[string]
}
/**
 * 是否定制
 * @param {String} string
 */
export function isCustomizedFilter(string) {
  const statusMap = ['现货', '定制']
  return statusMap[string]
}

/**
 * 是否显示
 * @param {String} string
 */
export function showFilter(string) {
  const statusMap = ['不显示', '显示']
  return statusMap[string]
}
/**
 * 是否启用
 * @param {String} string
 */
export function enableFilter(string) {
  const statusMap = ['禁用', '启用']
  return statusMap[string]
}
/**
 * 报价状态
 * @param {String} string
 */
export function priceStatusFilter(string) {
  const statusMap = ['未报价', '已报价', '已成单', '已放弃']
  return statusMap[string]
}
/**
 * 支付状态
 * @param {String} string
 */
export function paymentStatusFilter(string) {
  const statusMap = ['未付款', '已付款', '部分付款']
  return statusMap[string]
}
/**
 * 货币类型
 * @param {String} string
 */
export function currencyFilter(string) {
  const statusMap = ['CNY', 'USD', 'INR', 'EUR']
  return statusMap[string]
}
/**
 * 单位
 * unit-单位,1-mg,2-g,3-kg,4-ml,5-l,6-t,7-mm,8-cm,9-m,10-支,11-瓶,12-个,13-把,14-套,15-组,16-盒,17-台,18-包
 */
export function unitFilter(string) {
  const statusMap = ['mg', 'g', 'kg', 'ML', 'L', 'T','mm','cm','m','支','瓶','个','把','套','组','盒','台','包']
  return statusMap[string-1]
}

/**
 * 销售订单状态
 * @param {String} string
 */
export function customerOrderStatusFilter(string) {
  const statusMap = ['未确认', '已确认', '订单完成', '取消']
  return statusMap[string]
}
/**
 * 发票类型
 * @param {String} string
 */
export function invoiceTypeFilter(string) {
  const statusMap = ['增值税普通发票(13%)', '增值税普通发票(3%)', '增值税专用发票(13%)', '不开票']
  return statusMap[string]
}