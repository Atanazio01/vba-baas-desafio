import axios, { type AxiosError } from 'axios'
import { ApiError } from '../../errors/ApiError'
import { clearToken, getToken } from '../../utils/storage'
import {
  isAuthAttemptRequest,
  isSessionExpiredRequest,
  notifySessionExpired,
} from './session'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const http = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    const url = error.config?.url
    const status = error.response?.status

    if (
      status === 401 &&
      getToken() &&
      !isAuthAttemptRequest(url) &&
      isSessionExpiredRequest(url)
    ) {
      clearToken()
      notifySessionExpired()
    }

    const message = error.response?.data?.message
    const text = Array.isArray(message)
      ? message.join(', ')
      : (message ?? error.message)

    throw new ApiError(text, status ?? 500)
  },
)

export { API_URL }
