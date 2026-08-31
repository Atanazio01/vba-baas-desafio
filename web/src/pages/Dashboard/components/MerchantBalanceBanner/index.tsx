import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Spinner } from '../../../../components/atoms/Spinner';
import { useAuth } from '../../../../context/AuthContext/useAuth';
import { ROUTES } from '../../../../routes/paths';
import { walletService } from '../../../../services/wallet/WalletService';
import { getApiErrorMessage } from '../../../../utils/getApiErrorMessage';
import { isGatewayReconnectError } from '../../../../utils/isLeraTokenError';

export function MerchantBalanceBanner() {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => walletService.getBalance(),
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className="flex h-36 items-center justify-center rounded-2xl bg-navy-900">
        <Spinner className="border-white/30 border-t-white" />
      </div>
    )
  }

  if (error) {
    const needsReconnect = isGatewayReconnectError(error)
  
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="text-sm font-medium">
          {needsReconnect
            ? 'Sessão Lera expirada ou inválida.'
            : 'Erro ao carregar saldo.'}
        </p>
        <p className="mt-1 text-sm">{getApiErrorMessage(error)}</p>
        {needsReconnect && (
          <Link
            to={ROUTES.RECONNECT}
            className="mt-4 inline-block text-sm font-semibold text-green-700 underline"
          >
            Reconectar conta Lera
          </Link>
        )}
      </div>
    )
  }

  return (
    <section className="rounded-2xl bg-linear-to-br from-navy-900 to-navy-950 p-6 text-white shadow-lg sm:p-8">
      <p className="text-sm font-medium text-gray-300">
        Olá, {user?.name?.split(' ')[0] ?? 'lojista'}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">
        Saldo disponível
      </p>
      <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {data?.balanceFormatted ?? 'R$ 0,00'}
      </p>
    </section>
  )
}
