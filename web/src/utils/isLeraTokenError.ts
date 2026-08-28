import { ApiError } from '../errors/ApiError'

export function isLeraTokenError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status === 401 &&
    /token inválido|expirado/i.test(error.message)
  )
}
