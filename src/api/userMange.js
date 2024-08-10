import request from '@/utils/request'

export function getUsers(data) {
  return request({
    url: '/user/search',
    method: 'post',
    data,
  })
}
