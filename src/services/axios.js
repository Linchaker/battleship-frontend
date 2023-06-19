import axios from 'axios'

export const Axios = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL + 'api',
  //withCredentials: true,
  // validateStatus: function (status) {
  //   return status >= 200 && status < 500;
  // }
})

let lang = localStorage.getItem('language')
Axios.defaults.headers.common['Content-Language'] = lang || 'en'

