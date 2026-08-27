export const PaymentStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const

export type PaymentStatus =
  (typeof PaymentStatus)[keyof typeof PaymentStatus]

export const WalletTransactionType = {
  PIX: 'PIX',
  CREDIT_CARD: 'CREDIT_CARD',
  WITHDRAWAL: 'WITHDRAWAL',
} as const

export type WalletTransactionType =
  (typeof WalletTransactionType)[keyof typeof WalletTransactionType]

export const PersonType = {
  PF: 'PF',
  PJ: 'PJ',
} as const

export type PersonType = (typeof PersonType)[keyof typeof PersonType]

export const PaymentMethod = {
  PIX: 'PIX',
  CARD: 'CARD',
} as const

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]
