import { useQuery } from '@tanstack/react-query';
import { walletService } from '../services/wallet/WalletService';
import { isGatewayReconnectError } from '../utils/isLeraTokenError';
import { useGatewayStatus } from './useGatewayStatus';

export function useGatewaySession() {
  const { connected, loading: statusLoading } = useGatewayStatus()

  const probe = useQuery({
    queryKey: ['wallet-probe'],
    queryFn: () => walletService.getBalance(),
    enabled: connected,
    retry: (_, error) => !isGatewayReconnectError(error),
  })

  const loading =
    statusLoading || (connected && (probe.isLoading || probe.isFetching))

  const needsReconnect =
    connected && probe.isError && isGatewayReconnectError(probe.error)

  return {
    connected,
    loading,
    needsReconnect,
    refetch: probe.refetch,
  }
}