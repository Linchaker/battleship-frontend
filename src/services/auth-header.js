export default function authHeader() {
    let user = JSON.parse(localStorage.getItem('user'))
    let token = JSON.parse(localStorage.getItem('token'))
    let lang = localStorage.getItem('language')
  
    if (user && token) {
      return { Authorization: 'Bearer ' + token, 'Content-Language': lang }
    } else {
      return {}
    }
  }
