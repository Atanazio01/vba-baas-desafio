import { http } from '../http/HttpClient'
import type {
  ConnectGatewayRequest,
  GatewayStatusResponse,
  RegisterGatewayRequest,
} from '../../types/gateway'

class GatewayService {
  register(data: RegisterGatewayRequest) {
    return http
      .post<{ message: string }>('/gateway-accounts/register', data)
      .then((r) => r.data)
  }

  connect(data: ConnectGatewayRequest) {
    return http
      .post<{ connected: true; gatewayEmail: string }>(
        '/gateway-accounts/connect',
        data,
      )
      .then((r) => r.data)
  }

  getStatus() {
    return http
      .get<GatewayStatusResponse>('/gateway-accounts/status')
      .then((r) => r.data)
  }
}

export const gatewayService = new GatewayService()
