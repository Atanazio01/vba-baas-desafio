import { http } from '../http/HttpClient'
import type {
  ListTransactionsQuery,
  WalletBalance,
  WalletTransactionsResponse,
} from '../../types/wallet'

class WalletService {
  getBalance() {
    return http.get<WalletBalance>('/wallet').then((r) => r.data)
  }

  listTransactions(query: ListTransactionsQuery = {}) {
    return http
      .get<WalletTransactionsResponse>('/wallet/transactions', { params: query })
      .then((r) => r.data)
  }
}

export const walletService = new WalletService()
