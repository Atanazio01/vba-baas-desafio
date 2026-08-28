import type { PaymentStatus, WalletTransactionType } from '../../../../types/enums'
import { PaymentStatus as PS, WalletTransactionType as WTT } from '../../../../types/enums'
import {
  paymentStatusLabels,
  walletTransactionTypeLabels,
} from '../../../../utils/transactionLabels'

type Props = {
  status: PaymentStatus | ''
  type: WalletTransactionType | ''
  onStatusChange: (v: PaymentStatus | '') => void
  onTypeChange: (v: WalletTransactionType | '') => void
}

export function TransactionFilters({
  status,
  type,
  onStatusChange,
  onTypeChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as PaymentStatus | '')}
      >
        <option value="">Todos os status</option>
        {Object.values(PS).map((s) => (
          <option key={s} value={s}>
            {paymentStatusLabels[s]}
          </option>
        ))}
      </select>
      <select
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        value={type}
        onChange={(e) => onTypeChange(e.target.value as WalletTransactionType | '')}
      >
        <option value="">Todos os tipos</option>
        {Object.values(WTT).map((t) => (
          <option key={t} value={t}>
            {walletTransactionTypeLabels[t]}
          </option>
        ))}
      </select>
    </div>
  )
}
