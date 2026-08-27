import { useQuery } from '@tanstack/react-query'
import type { PaymentStatus, WalletTransactionType } from '../../../../types/enums'
import { StatusBadge } from '../../../../components/molecules/StatusBadge'
import { Spinner } from '../../../../components/atoms/Spinner'
import { useAuth } from '../../../../context/AuthContext/useAuth'
import { walletService } from '../../../../services/wallet/WalletService'
import { getApiErrorMessage } from '../../../../utils/getApiErrorMessage'

type Props = {
  status: PaymentStatus | ''
  type: WalletTransactionType | ''
}

export function TransactionList({ status, type }: Props) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <p className="py-8 text-center text-sm text-red-600">
        Erro ao carregar transações: {getApiErrorMessage(error)}
      </p>
    )
  }

  if (!data?.transactions.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        Nenhuma transação encontrada.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-gray-100">
      {data.transactions.map((tx) => (
        <li key={tx.id} className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {tx.description ?? tx.type}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(tx.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-semibold text-gray-900">
              {tx.amountFormatted}
            </span>
            <StatusBadge status={tx.status} />
          </div>
        </li>
      ))}
    </ul>
  )
}
