import type { PaymentStatus, WalletTransactionType } from '../types/enums'

export type WalletBalance = {
  balanceCents: number
  balanceFormatted: string
  updatedAt: string
}

export type WalletTransaction = {
  id: string
  type: WalletTransactionType
  status: PaymentStatus
  denialReason: string | null
  amount: number
  amountFormatted: string
  description: string | null
  message: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

export type WalletTransactionsResponse = {
  balanceCents: number
  balanceFormatted: string
  filters: { status: string | null; type: string | null }
  transactions: WalletTransaction[]
}

export type ListTransactionsQuery = {
  limit?: number
  status?: PaymentStatus
  type?: WalletTransactionType
}
