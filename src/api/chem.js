import request from '@/utils/request'

// 获取列表
export function fetchList(query) {
  return request({
    url: '/chem/products',
    method: 'get',
    params: query
  })
}

// 创建
export function create(data) {
  return request({
    url: '/chem/products',
    method: 'POST',
    data: data
  })
}

// 更新
export function update(query) {
  return request({
    url: '/chem/products/' + query.id,
    method: 'PUT',
    data: query
  })
}