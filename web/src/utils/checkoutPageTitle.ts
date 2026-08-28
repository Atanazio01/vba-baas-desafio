import { PaymentMethod, PaymentStatus } from '../types/enums'
import type { PaymentMethod as PaymentMethodType, PaymentStatus as PaymentStatusType } from '../types/enums'

export function getPublicCheckoutTitle(
  method: PaymentMethodType,
  status: PaymentStatusType,
): string {
  if (status === PaymentStatus.DENIED) {
    return 'Pagamento não concluído'
  }

  if (method === PaymentMethod.CARD) {
    return status === PaymentStatus.APPROVED ? 'Comprovante cartão' : 'Pagamento cartão'
  }

  return status === PaymentStatus.APPROVED ? 'Comprovante Pix' : 'Pagamento Pix'
}
