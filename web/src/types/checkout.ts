import type { PaymentMethod, PaymentStatus } from '../types/enums'

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
