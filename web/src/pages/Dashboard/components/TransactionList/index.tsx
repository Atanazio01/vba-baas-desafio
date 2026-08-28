import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { PaymentStatus, WalletTransactionType } from '../../../../types/enums'
import { StatusBadge } from '../../../../components/molecules/StatusBadge'
import { Spinner } from '../../../../components/atoms/Spinner'
import { useAuth } from '../../../../context/AuthContext/useAuth'
import { walletService } from '../../../../services/wallet/WalletService'
import { getApiErrorMessage } from '../../../../utils/getApiErrorMessage'
import { walletTransactionTypeLabels } from '../../../../utils/transactionLabels'
import {
  getTransactionAmountDisplay,
} from '../../../../utils/transactionAmount'

type Props = {
  status: PaymentStatus | ''
  type: WalletTransactionType | ''
  onCountChange?: (count: number) => void
}

export function TransactionList({ status, type, onCountChange }: Props) {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['wallet-transactions', status, type],
    queryFn: () =>
      walletService.listTransactions({
        limit: 50,
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
      }),
    enabled: !!user,
  })

  const count = data?.transactions.length ?? 0

  useEffect(() => {
    onCountChange?.(count)
  }, [count, onCountChange])

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-48 items-center justify-center px-4">
        <p className="text-center text-sm text-red-600">
          Erro ao carregar transações: {getApiErrorMessage(error)}
        </p>
      </div>
    )
  }

  if (!count) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <p className="text-center text-sm text-gray-500">
          Nenhuma transação encontrada.
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-gray-100">
      {(data?.transactions ?? []).map((tx, index) => {
        const amount = getTransactionAmountDisplay(tx)

        return (
        <li
          key={tx.id}
          className={`flex items-center justify-between gap-4 py-3 ${
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'
          } -mx-6 px-6`}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {tx.description ?? walletTransactionTypeLabels[tx.type] ?? tx.type}
            </p>
            <p className="text-xs text-gray-500">
              {walletTransactionTypeLabels[tx.type] ?? tx.type} ·{' '}
              {new Date(tx.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span
              className={`text-sm font-bold tabular-nums ${amount.className}`}
            >
              {amount.label}
            </span>
            <StatusBadge status={tx.status} />
          </div>
        </li>
        )
      })}
    </ul>
  )
}
