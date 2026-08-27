import type { PaymentStatus } from '../types/enums'

export type CreateWithdrawalRequest = {
  amountCents: number
  pixKey: string
  document: string
  description?: string
}

export type WithdrawalResponse = {
  id: string
  externalReference: string
  amountCents: number
  status: PaymentStatus
  destinationType: string
  pixKey: string
  gatewayWithdrawalId: string | null
  createdAt?: string
  updatedAt?: string
}
