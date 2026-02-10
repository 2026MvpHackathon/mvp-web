import axios from 'axios'
import { getCookie } from '@/features/Auth/cookies'

const baseURL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: baseURL || undefined,
})

/** 로그인한 계정의 토큰 사용(쿠키). Study/채팅 등이 계정마다 구분되도록 함 */
const resolveToken = () => {
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_DEV_ACCESS_TOKEN || ''
  }
  const cookieToken = getCookie('accessToken')
  if (cookieToken) return cookieToken
  return import.meta.env.VITE_DEV_ACCESS_TOKEN || ''
}

apiClient.interceptors.request.use((config) => {
  const token = resolveToken()
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

