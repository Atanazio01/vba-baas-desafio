import { Link } from 'react-router-dom'
import { Button } from '../../components/atoms/Button'
import { Input } from '../../components/atoms/Input'
import { AuthCard } from '../../components/molecules/AuthCard'
import { FormField } from '../../components/molecules/FormField'
import { AuthLayout } from '../../components/templates/AuthLayout'
import { ROUTES } from '../../routes/paths'
import { useLogin } from './useLogin'

export function LoginPage() {
  const { email, setEmail, password, setPassword, loading, error, handleSubmit } =
    useLogin()

  return (
    <AuthLayout>
      <AuthCard title="Entrar na sua conta" subtitle="Acesse seu dashboard BaaS">
        <form onSubmit={handleSubmit}>
          <FormField label="E-mail" htmlFor="email" error={error ?? undefined}>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              error={!!error}
            />
          </FormField>
          <FormField label="Senha" htmlFor="password">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </FormField>
          <Button type="submit" className="w-full" loading={loading}>
            Entrar
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem conta?{' '}
          <Link to={ROUTES.SIGNUP} className="font-semibold text-green-600">
            Criar conta
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}

export default LoginPage
