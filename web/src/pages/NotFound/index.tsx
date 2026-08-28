import { Link } from 'react-router-dom'
import { ROUTES } from '../../routes/paths'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">Página não encontrada.</p>
      <Link to={ROUTES.LOGIN} className="mt-6 font-semibold text-green-600">
        Ir para login
      </Link>
    </div>
  )
}

export default NotFoundPage
