import request from '@/utils/request'


//获取七牛云token
export function getToken() {
  return request({
    url: '/commons/get_qiniu_token',
    method: 'get'
  })
}


//创建上传附件信息
export function uploadAttachment(query) {
  return request({
    url: '/commons/upload_attachment',
    method: 'post',
    data: query
  })
}