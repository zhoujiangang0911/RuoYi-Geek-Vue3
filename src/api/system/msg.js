import request from '@/utils/request'

// 查询sys_msg列表
export function listMsg(query) {
  return request({
    url: '/system/msg/list',
    method: 'get',
    params: query
  })
}

// 查询sys_msg详细
export function getMsg(id) {
  return request({
    url: '/system/msg/' + id,
    method: 'get'
  })
}

// 新增sys_msg
export function addMsg(data) {
  return request({
    url: '/system/msg',
    method: 'post',
    data: data
  })
}

// 修改sys_msg
export function updateMsg(data) {
  return request({
    url: '/system/msg',
    method: 'put',
    data: data
  })
}

// 删除sys_msg
export function delMsg(id) {
  return request({
    url: '/system/msg/' + id,
    method: 'delete'
  })
}
