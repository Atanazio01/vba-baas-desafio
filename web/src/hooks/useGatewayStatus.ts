import { useQuery } from '@tanstack/react-query'
import { gatewayService } from '../services/gateway/GatewayService'

export function useGatewayStatus() {
  const query = useQuery({
    queryKey: ['gateway-status'],
    queryFn: () => gatewayService.getStatus(),
    retry: false,
  })

  return {
    connected: query.data?.connected ?? false,
    gatewayEmail:
      query.data?.connected === true ? query.data.gatewayEmail : undefined,
    loading: query.isLoading,
    refetch: query.refetch,
  }
}
