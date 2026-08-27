import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/Button'
import { useAuth } from '../../../context/AuthContext/useAuth'
import { ROUTES } from '../../../routes/paths'

export function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="text-lg font-bold text-gray-900"
        >
          BaaS
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <Button variant="secondary" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
