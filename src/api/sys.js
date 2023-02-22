import request from '@/utils/request'

// 获取列表
export function fetchList(query) {
  return request({
    url: '/sys/templates',
    method: 'get',
    params: query
  })
}

// 创建
export function create(data) {
  return request({
    url: '/sys/templates',
    method: 'POST',
    data: data
  })
}

// 更新
export function update(query) {
  return request({
    url: '/sys/templates/' + query.id,
    method: 'PUT',
    data: query
  })
}

// 创建上传附件信息
export function uploadAttachment(query) {
  return request({
    url: '/sys/templates/upload_attachment',
    method: 'get',
    params: query
  })
}

// 获取附件列表
export function attachmentList(query) {
  return request({
    url: '/sys/templates/attachment_list',
    method: 'get',
    params: query
  })
}


// 菜单栏列表
export function menuBarSettingsList(query) {
  return request({
    url: '/sys/menu_bar_settings',
    method: 'get',
    params: query
  })
}

// 修改权限信息
export function updateMenuBarSettings(query) {
  return request({
    url: '/sys/menu_bar_settings/' + query.id,
    method: 'PUT',
    data: query
  })
}

// 用户设置列表(认证)
export function employeeSettingsList(query) {
  return request({
    url: '/sys/employee_settings',
    method: 'get',
    params: query
  })
}

// 添加用户设置(认证)
export function addEmployeeSettings(data) {
  return request({
    url: '/sys/employee_settings',
    method: 'POST',
    data: data
  })
}

// 修改用户设置(认证)
export function updateEmployeeSettings(query) {
  return request({
    url: '/sys/employee_settings/' + query.id,
    method: 'PUT',
    data: query
  })
}

//删除用户设置(认证)
export function deleteEmployeeSettings(query) {
  return request({
    url: '/commons/delete_logistics_info/' + query.id,
    method: 'DELETE',
    data: query
  })
}

// 数据报表列表(认证)
export function reportForms(query) {
  return request({
    url: '/sys/charts/report_forms',
    method: 'get',
    params: query
  })
}

// 添加数据报表(认证)
export function addReportForms(data) {
  return request({
    url: '/sys/charts/create_report_form',
    method: 'POST',
    data: data
  })
}

// 修改数据报表(认证)
export function updateReportForms(query) {
  return request({
    url: 'sys/charts/update_report_form',
    method: 'PUT',
    data: query
  })
}

//数据报表删除用户设置(认证)
export function deleteReportForms(query) {
  return request({
    url: '/sys/charts/destroy_report_form',
    method: 'DELETE',
    data: query
  })
}

// 图形报表列表(认证)
export function chartsForms(query) {
  return request({
    url: '/sys/charts',
    method: 'get',
    params: query
  })
}

// 添加图形报表(认证)
export function addChartsForms(data) {
  return request({
    url: '/sys/charts',
    method: 'POST',
    data: data
  })
}

// 修改图形报表(认证)
export function updateChartsForms(query) {
  return request({
    url: '/sys/charts/' + query.id,
    method: 'PUT',
    data: query
  })
}
//删除用户设置(认证)
export function deleteChartsForms(query) {
  return request({
    url: '/sys/charts/' + query.id,
    method: 'DELETE',
    data: query
  })
}
//获取角色信息(认证)
export function chartsFormsRole(query) {
  return request({
    url: '/sys/charts/role',
    method: 'get',
    params: query
  })
}

//分配角色(认证)
export function updateChartsFormsRole(query) {
  return request({
    url: '/sys/charts/update_role',
    method: 'PUT',
    data: query
  })
}

//  操作日志列表
export function adminOperateLogs(query) {
  return request({
    url: '/sys/admin_operate_logs',
    method: 'get',
    params: query
  })
}
