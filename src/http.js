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
    return response.data
    // let result = response.data
    // if (result.errorCode === 'TOKEN_NOT_EXIST') {
    //   router.push({
    //     path: '/'
    //   })
    //   window.location.reload()
    // } else {
    // }
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
