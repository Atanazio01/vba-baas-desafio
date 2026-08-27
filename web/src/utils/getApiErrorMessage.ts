import { ApiError } from '../errors/ApiError'

export function getApiErrorMessage(error: unknown, fallback = 'Erro inesperado.') {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}
