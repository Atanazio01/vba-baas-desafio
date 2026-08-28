import { Button } from '../../atoms/Button'
import { StatusBadge } from '../StatusBadge'
import type { PaymentStatus } from '../../../types/enums'
import { PaymentStatus as PaymentStatusEnum } from '../../../types/enums'
import { formatMoney } from '../../../utils/formatMoney'
import { getPixQrImageSrc } from '../../../utils/pixQr'

type Props = {
  amountCents: number
  status: PaymentStatus
  pixEmv?: string | null
  pixQrBase64?: string | null
  onCopyEmv?: () => void
}

const statusMessages: Partial<Record<PaymentStatus, string>> = {
  [PaymentStatusEnum.APPROVED]: 'Pagamento já confirmado.',
  [PaymentStatusEnum.DENIED]: 'Cobrança negada.',
  [PaymentStatusEnum.EXPIRED]: 'Cobrança expirada.',
  [PaymentStatusEnum.CANCELLED]: 'Cobrança cancelada.',
}

export function PixPaymentDetails({
  amountCents,
  status,
  pixEmv,
  pixQrBase64,
  onCopyEmv,
}: Props) {
  const isPending = status === PaymentStatusEnum.PENDING
  const isPaid = status === PaymentStatusEnum.APPROVED

  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-3xl font-bold text-green-600">{formatMoney(amountCents)}</p>
        <div className="mt-3 flex justify-center">
          <StatusBadge status={status} />
        </div>
      </div>

      {isPending && pixQrBase64 && (
        <div className="mb-6 flex justify-center">
          <img
            src={getPixQrImageSrc(pixQrBase64)}
            alt="QR Code Pix"
            className="h-48 w-48 rounded-lg border border-gray-200"
          />
        </div>
      )}

      {isPending && pixEmv && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-gray-600">Pix copia e cola</p>
          <p className="break-all rounded-lg bg-gray-50 p-3 text-xs text-gray-800">
            {pixEmv}
          </p>
          {onCopyEmv && (
            <Button variant="secondary" className="mt-3 w-full" onClick={onCopyEmv}>
              Copiar código
            </Button>
          )}
        </div>
      )}

      {!isPending && (
        <p className="text-center text-sm text-gray-600">
          {statusMessages[status] ?? 'Cobrança não disponível para pagamento.'}
        </p>
      )}

      {isPaid && (
        <div className="mt-4 text-center">
          <Button variant="secondary" className="w-full" onClick={() => window.print()}>
            Imprimir comprovante
          </Button>
        </div>
      )}
    </>
  )
}
