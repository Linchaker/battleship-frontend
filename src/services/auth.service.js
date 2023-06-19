import { Axios } from '@/services/axios'
import authHeader from './auth-header'

class AuthService {

  login(userLogin) {
    return Axios
      .post('/auth/login', userLogin)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', JSON.stringify(response.data.token));
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
      });
  }

  register(userRegObj) {
    return Axios.post('/auth/register', userRegObj);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}

export default new AuthService();






// export function loginAuthService(userLogin) {
//   return Axios.post('/auth/login', userLogin)
//     .then(response => {
//       if (response.status >= 200 && response.status <= 204) {
//         localStorage.setItem('user', JSON.stringify({
//           name: response.data.user.name || null,
//           email: response.data.user.email || null,
//         }));
//         localStorage.setItem('token', JSON.stringify(response.data.token));
//       }
//       return response
//     })
//     .catch(error => error)
// }

// export function registerAuthService(user) {
//   return Axios.post('/auth/register', user)
//     .then(res => res)
//     .catch(error => error)
// }
