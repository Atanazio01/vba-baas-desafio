import { useQuery } from '@tanstack/react-query'
import { walletService } from '../../../../services/wallet/WalletService'
import { Spinner } from '../../../../components/atoms/Spinner'

export function BalanceCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => walletService.getBalance(),
  })

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Erro ao carregar saldo.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-600">Saldo disponível</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {data?.balanceFormatted ?? 'R$ 0,00'}
      </p>
    </div>
  )
}
