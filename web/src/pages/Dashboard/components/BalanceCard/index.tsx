import { useQuery } from '@tanstack/react-query'
import { Spinner } from '../../../../components/atoms/Spinner'
import { useAuth } from '../../../../context/AuthContext/useAuth'
import { walletService } from '../../../../services/wallet/WalletService'
import { getApiErrorMessage } from '../../../../utils/getApiErrorMessage'

export function BalanceCard() {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => walletService.getBalance(),
    enabled: !!user,
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
        <p className="text-sm font-medium">Erro ao carregar saldo.</p>
        <p className="mt-1 text-sm">{getApiErrorMessage(error)}</p>
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
