import { useQuery } from '@tanstack/react-query'
import { walletService } from '../services/wallet/WalletService'
import { isLeraTokenError } from '../utils/isLeraTokenError'
import { useGatewayStatus } from './useGatewayStatus'

export function useGatewaySession() {
  const { connected, loading: statusLoading } = useGatewayStatus()

  const probe = useQuery({
    queryKey: ['wallet-probe'],
    queryFn: () => walletService.getBalance(),
    enabled: connected,
    retry: false,
  })

  const loading =
    statusLoading || (connected && (probe.isLoading || probe.isFetching))

  const needsReconnect =
    connected && probe.isError && isLeraTokenError(probe.error)

  return {
    connected,
    loading,
    needsReconnect,
    refetch: probe.refetch,
  }
}
