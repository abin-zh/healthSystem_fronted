import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'
import { method } from 'lodash'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/staff/login',
    method: 'post',
    data,
  })
}

export function getEmailCode(data) {
  return request({
    method: 'post',
    url: '/staff/email/code',
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: 'staff/info',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
