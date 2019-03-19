import axios from 'axios'
import router from './router'

// axios 配置
axios.defaults.baseURL = process.env.BASE_API_ADDR_TEST

// http request 拦截器
axios.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem('App-Token')
    if (token) {
      config.headers['token'] = token
      config.headers['clientType'] = 'mer'
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    let result = response.data
    if (result.errorCode === 'invalid_token') {
      router.replace({
        path: '/bindAccount',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    } else {
      return response.data
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('response.status: 401')
      }
    }
    console.log(JSON.stringify(error))
    return Promise.reject(error.data)
  }
)

export default axios
