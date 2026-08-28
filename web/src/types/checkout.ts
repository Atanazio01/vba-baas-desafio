import type { CardBrand, PaymentMethod, PaymentStatus } from '../types/enums'

export type CreatePixRequest = {
  amountCents: number
  payerDocument: string
  description?: string
}

export type PixCheckoutResponse = {
  id: string
  publicId: string
  externalReference: string
  amountCents: number
  status: PaymentStatus
  method: PaymentMethod
  orderId: string
  pixEmv: string | null
  pixQrBase64: string | null
  gatewayPaymentId: string | null
  paidAt: string | null
}

export type PublicCheckoutResponse = {
  publicId: string
  amountCents: number
  status: PaymentStatus
  method: PaymentMethod
  pixEmv?: string | null
  pixQrBase64?: string | null
  brand?: string | null
  installments?: number | null
  feePercent?: string | null
}

export type CreateCardRequest = {
  amountCents: number
  description?: string
  cardNumber: string
  cardHolder: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  installments: number
  feePercent: number
  brand: CardBrand
}

export type CardCheckoutResponse = {
  id: string
  publicId: string
  externalReference: string
  amountCents: number
  status: PaymentStatus
  method: PaymentMethod
  brand: string
  installments: number
  feePercent: string
  orderId: string
  gatewayPaymentId: string | null
  paidAt: string | null
}

export type SendCheckoutEmailRequest = {
  to: string
  message?: string
}

export type SendCheckoutEmailResponse = {
  sent: boolean
  to: string
  checkoutUrl: string
}
