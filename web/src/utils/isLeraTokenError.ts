import { ApiError } from '../errors/ApiError';

const GATEWAY_RECONNECT_MESSAGE =
  /GATEWAY_RECONNECT_REQUIRED|reconnect|reconecte|sessão lera|lera account|token inválido|expirado/i

export function isGatewayReconnectError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false
  return GATEWAY_RECONNECT_MESSAGE.test(error.message)
}
