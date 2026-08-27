import type { PaymentStatus } from '../../../types/enums'

const styles: Record<PaymentStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-800',
  APPROVED: 'bg-green-50 text-green-700',
  DENIED: 'bg-red-50 text-red-700',
  EXPIRED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

const labels: Record<PaymentStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  DENIED: 'Negado',
  EXPIRED: 'Expirado',
  CANCELLED: 'Cancelado',
}

export function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}
