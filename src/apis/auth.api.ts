import { AuthResponse } from '@/types/auth.type'
import http from '@/utils/http'

export const URL_ADMIN_LOGIN = 'admin/auth/login'
export const URL_ADMIN_REGISTER = 'admin/auth/register'
export const URL_ADMIN_LOGOUT = 'admin/auth/logout'

export const URL_LOGIN = 'auth/login'
export const URL_REGISTER = 'auth/register'
export const URL_LOGOUT = 'auth/logout'

const authApi = {
  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  }
}

export default authApi
