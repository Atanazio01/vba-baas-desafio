import type { PaymentStatus, WalletTransactionType } from '../types/enums'
import { PaymentStatus as PS, WalletTransactionType as WTT } from '../types/enums'

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PS.PENDING]: 'Pendente',
  [PS.APPROVED]: 'Aprovado',
  [PS.DENIED]: 'Negado',
  [PS.EXPIRED]: 'Expirado',
  [PS.CANCELLED]: 'Cancelado',
}

export const walletTransactionTypeLabels: Record<WalletTransactionType, string> = {
  [WTT.PIX]: 'Pix',
  [WTT.CREDIT_CARD]: 'Cartão',
  [WTT.WITHDRAWAL]: 'Saque',
}
