import axios from 'axios'

const baseURL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: baseURL || undefined,
})

const resolveToken = () => {
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_DEV_ACCESS_TOKEN || ''
  }
  const stored = window.localStorage.getItem('accessToken')
  if (stored) return stored
  const envToken = import.meta.env.VITE_DEV_ACCESS_TOKEN
  if (envToken) {
    window.localStorage.setItem('accessToken', envToken)
    return envToken
  }
  return ''
}

apiClient.interceptors.request.use((config) => {
  const token = resolveToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config
})

