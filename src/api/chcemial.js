import request from '@/utils/request'

//商品信息
export function fetchList(query) {
  return request({
    url: '/chemical_link/goods',
    method: 'get',
    params: query
  })
}

// 新增商品信息
export function create(query) {
  return request({
    url: '/chemical_link/goods',
    method: 'POST',
    data: query
  })
}

//编辑商品信息
export function updateGoods(query,id) {
  return request({
    url: '/chemical_link/goods/' + id,
    method: 'PUT',
    data: query
  })
}

//上下架商品
export function activeGoods(query,id) {
  return request({
    url: '/chemical_link/goods/' + id + '/active',
    method: 'PUT',
    data: query
  })
}

//求购信息
export function getPurchaseIntentions(query) {
  return request({
    url: '/chemical_link/purchase_intentions',
    method: 'get',
    params: query
  })
}

//用户信息
export function fetchUserInfosList(query) {
  return request({
    url: '/chemical_link/user_infos',
    method: 'get',
    params: query
  })
}

//删除商品(认证)
export function deleteGoods(query) {
  return request({
    url: '/chemical_link/goods/' + query.id,
    method: 'DELETE',
    data: query
  })
}

//咨询信息
export function getArticles(query) {
  return request({
    url: '/chemical_link/articles',
    method: 'get',
    params: query
  })
}

// 批量新增咨询信息
export function importArticles(query) {
  return request({
    url: '/commons/import_article_data',
    method: 'POST',
    data: query
  })
}

// 新增咨询信息
export function createArticles(query) {
  return request({
    url: '/chemical_link/articles',
    method: 'POST',
    data: query
  })
}

//编辑咨询信息
export function updateArticles(query,id) {
  return request({
    url: '/chemical_link/articles/' + id,
    method: 'PUT',
    data: query
  })
}


//删除商品(认证)
export function deleteArticles(query) {
  return request({
    url: '/chemical_link/articles/' + query.id,
    method: 'DELETE',
    data: query
  })
}