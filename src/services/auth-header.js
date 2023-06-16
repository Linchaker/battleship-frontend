export default function authHeader() {
    let user = JSON.parse(localStorage.getItem('user'))
    let lang = localStorage.getItem('language')
  
    if (user) {
      return { Authorization: 'Bearer ' + user, 'Content-Language': lang }
    }
    return {}
  }
  