import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from '@/apis/auth.api'
import config from '@/constants/config'
import { AuthResponse } from '@/types/auth.type'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS } from '@/utils/auth'
import axios, { AxiosError, type AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance
  private access_token: string
  constructor() {
    this.access_token = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.access_token && config.headers) {
          config.headers.Authorization = this.access_token
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse
          this.access_token = data.data.access_token
          setAccessTokenToLS(this.access_token)
        } else if (url === URL_LOGOUT) {
          this.access_token = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        console.log(error, 'err axios')
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
