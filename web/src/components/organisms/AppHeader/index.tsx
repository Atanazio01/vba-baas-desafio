import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext/useAuth'
import { ROUTES } from '../../../routes/paths'

export function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="border-b border-navy-800 bg-navy-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="text-left"
        >
          <span className="block text-lg font-bold tracking-tight">BaaS</span>
          <span className="block text-xs font-medium text-gray-300">
            Carteira do lojista
          </span>
        </button>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-200 sm:inline">{user?.name}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
