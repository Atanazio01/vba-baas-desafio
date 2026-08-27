import { Navigate, Outlet } from 'react-router-dom'
import { useGatewayStatus } from '../hooks/useGatewayStatus'
import { ROUTES } from './paths'

export function GatewayRoute() {
  const { connected, loading } = useGatewayStatus()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    )
  }

  if (!connected) {
    return <Navigate to={ROUTES.ONBOARDING} replace />
  }

  return <Outlet />
}
