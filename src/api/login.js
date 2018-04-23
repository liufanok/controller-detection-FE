import request from '@/utils/request'
var qs = require('qs')
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'api/v1/site/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'api/v1/site/user-info',
    method: 'post',
    params: { token }
  })
}

