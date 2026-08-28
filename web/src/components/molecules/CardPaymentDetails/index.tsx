import { Button } from '../../atoms/Button'
import { StatusBadge } from '../StatusBadge'
import type { PaymentStatus } from '../../../types/enums'
import { PaymentStatus as PaymentStatusEnum } from '../../../types/enums'
import {
  formatInstallmentLabel,
  getInstallmentCents,
} from '../../../utils/cardPayment'
import { formatMoney } from '../../../utils/formatMoney'

type Props = {
  amountCents: number
  status: PaymentStatus
  brand?: string | null
  installments?: number | null
  feePercent?: string | null
}

const statusMessages: Partial<Record<PaymentStatus, string>> = {
  [PaymentStatusEnum.APPROVED]: 'Pagamento confirmado.',
  [PaymentStatusEnum.DENIED]: 'Não foi possível concluir este pagamento.',
  [PaymentStatusEnum.PENDING]: 'Aguardando confirmação do pagamento…',
  [PaymentStatusEnum.EXPIRED]: 'Cobrança expirada.',
  [PaymentStatusEnum.CANCELLED]: 'Cobrança cancelada.',
}

function formatFeePercent(feePercent: string | null | undefined): string {
  if (!feePercent) return '—'
  const value = Number(feePercent)
  if (Number.isNaN(value)) return feePercent
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

export function CardPaymentDetails({
  amountCents,
  status,
  brand,
  installments,
  feePercent,
}: Props) {
  const isPaid = status === PaymentStatusEnum.APPROVED

  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-3xl font-bold text-green-600">{formatMoney(amountCents)}</p>
        <div className="mt-3 flex justify-center">
          <StatusBadge status={status} />
        </div>
      </div>

      <dl className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-600">Bandeira</dt>
          <dd className="font-medium text-gray-900">{brand ?? '—'}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-600">Parcelamento</dt>
          <dd className="font-medium text-gray-900">
            {installments && installments > 1
              ? `${formatInstallmentLabel(installments)} de ${formatMoney(getInstallmentCents(amountCents, installments))}`
              : installments === 1
                ? 'À vista'
                : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-600">Taxa aplicada</dt>
          <dd className="font-medium text-gray-900">{formatFeePercent(feePercent)}</dd>
        </div>
      </dl>

      <p className="text-center text-sm text-gray-600">
        {statusMessages[status] ?? 'Status do pagamento.'}
      </p>

      {isPaid && (
        <div className="mt-4">
          <Button variant="secondary" className="w-full" onClick={() => window.print()}>
            Imprimir comprovante
          </Button>
        </div>
      )}
    </>
  )
}
