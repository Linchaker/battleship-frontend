import { Axios } from '@/services/axios'
import authHeader from './auth-header'


export function loginAuthService(userLogin) {
  return Axios.post('/auth/login', userLogin)
    .then(res => {
      if (res.data.token) {
        localStorage.setItem('user', JSON.stringify(res.data.token))
        return res.data
      }
      return res
    })
    .catch(error => error)
}

export function registerAuthService(user) {
  return Axios.post('/auth/register', user)
    .then(res => res)
    .catch(error => error)
}
