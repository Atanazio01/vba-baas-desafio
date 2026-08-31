import { ApiError } from '../errors/ApiError';

const GATEWAY_RECONNECT_MESSAGE =
  /GATEWAY_RECONNECT_REQUIRED|reconecte|sessão lera|token inválido|expirado/i

export function isGatewayReconnectError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false
  return GATEWAY_RECONNECT_MESSAGE.test(error.message)
}

export const isLeraTokenError = isGatewayReconnectError