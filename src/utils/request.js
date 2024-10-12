import axios from 'axios'
import { message } from '@/utils/resetMessage.js'
import { useUserStore } from '@/stores'
import qs from 'qs'
const baseURL = 'http://localhost:13000'
axios.defaults.withCredentials = true
const request = axios.create({
  baseURL,
  timeout: 5000
})
let refreshing = false
let promise
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore?.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

request.interceptors.response.use(
  (res) => {
    if (res.data.code === 200) {
      return res.data
    }
    message.error(res.data.msg || '服务器异常')
    return Promise.reject(res.data)
  },
  async (err) => {
    if (err.response?.status === 401) {
      const code = err.response.data.code
      const userStore = useUserStore()
      const refreshToken = userStore.refreshToken
      if (code === 6002) {
        // 令牌过期 刷新令牌
        const refreshTokenParams = {
          client_id: 'petmall-client-auth',
          client_secret: 'petmall-web-auth-server',
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }
        const refreshTokenApi = (refreshTokenParams) => {
          if (refreshing) {
            return promise
          }
          refreshing = true
          promise = request
            .post('/auth/oauth/token?', qs.stringify(refreshTokenParams), {
              Headers: {
                'content-type': 'application/x-www-form-urlencoded'
              }
            })
            .finally(() => {
              refreshing = false
            })
          return promise
        }
        const res = await refreshTokenApi(refreshTokenParams)
        if (res.code === 200) {
          userStore.setToken(res.data.token_type + ' ' + res.data.access_token)
          userStore.setRefreshToken(res.data.refresh_token)
          userStore.getUserInfo()
          return request(err.config)
        }
      } else if (code === 6007) {
        userStore.logout()
      } else if (code === 6008) {
        userStore.logout()
      } else {
        message.error(err.response?.data.msg)
      }
    } else {
      message.error(err.response?.data.msg || '服务器异常')
    }
    return Promise.reject(err)
  }
)

export default request
export { baseURL }
