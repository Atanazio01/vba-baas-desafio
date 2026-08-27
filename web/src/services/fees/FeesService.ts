import { http } from '../http/HttpClient'
import type { GatewayFeesResponse } from '../../types/fees'

class FeesService {
  getFees(brand?: string) {
    return http
      .get<GatewayFeesResponse>('/fees', { params: brand ? { brand } : {} })
      .then((r) => r.data)
  }
}

export const feesService = new FeesService()
