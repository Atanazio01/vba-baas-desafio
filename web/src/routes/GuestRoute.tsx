import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext/useAuth'
import { ROUTES } from './paths'

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return children
}
