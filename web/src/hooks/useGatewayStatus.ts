import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext/useAuth'
import { gatewayService } from '../services/gateway/GatewayService'

export function useGatewayStatus() {
  const { user } = useAuth()

  const query = useQuery({
    queryKey: ['gateway-status'],
    queryFn: () => gatewayService.getStatus(),
    retry: false,
    enabled: !!user,
  })

  return {
    connected: query.data?.connected ?? false,
    gatewayEmail:
      query.data?.connected === true ? query.data.gatewayEmail : undefined,
    loading: !!user && query.isLoading,
    refetch: query.refetch,
  }
}
