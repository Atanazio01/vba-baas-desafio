import type { WalletTransaction } from '../types/wallet'
import { WalletTransactionType } from '../types/enums'
import { formatMoney } from './formatMoney'

export function getTransactionAmountDisplay(
  tx: Pick<WalletTransaction, 'type' | 'amount'>,
): { label: string; className: string } {
  const amount = formatMoney(tx.amount)

  if (tx.type === WalletTransactionType.WITHDRAWAL) {
    return {
      label: `- ${amount}`,
      className: 'text-red-600',
    }
  }

  return {
    label: amount,
    className: 'text-gray-900',
  }
}
