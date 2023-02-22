import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setName(name) {
  return Cookies.set('name',name)
}

export function setUserId(id) {
  return Cookies.set('userId',id)
}

export function getName() {
  return Cookies.get('name')
}

export function getUserId() {
  return Cookies.get('userId')
}

export function removeName() {
  return Cookies.remove('name')
}

export function removeUserId() {
  return Cookies.remove('userId')
}
