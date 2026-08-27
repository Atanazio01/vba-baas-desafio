import { http } from '../http/HttpClient'
import type {
  CreateWithdrawalRequest,
  WithdrawalResponse,
} from '../../types/withdrawal'

class WithdrawalService {
  create(data: CreateWithdrawalRequest) {
    return http.post<WithdrawalResponse>('/withdrawals', data).then((r) => r.data)
  }

  getById(id: string) {
    return http.get<WithdrawalResponse>(`/withdrawals/${id}`).then((r) => r.data)
  }
}

export const withdrawalService = new WithdrawalService()
