import { Link } from 'react-router-dom'
import { Button } from '../../components/atoms/Button'
import { Input } from '../../components/atoms/Input'
import { AuthCard } from '../../components/molecules/AuthCard'
import { FormField } from '../../components/molecules/FormField'
import { AuthLayout } from '../../components/templates/AuthLayout'
import { ROUTES } from '../../routes/paths'
import { useSignup } from './useSignup'

export function SignupPage() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useSignup()

  return (
    <AuthLayout>
      <AuthCard title="Criar conta" subtitle="Comece a usar o BaaS VBA Systems">
        <form onSubmit={handleSubmit}>
          <FormField label="Nome" htmlFor="name">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </FormField>
          <FormField label="E-mail" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </FormField>
          <FormField label="Senha" htmlFor="password" error={error ?? undefined}>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
              error={!!error}
            />
          </FormField>
          <Button type="submit" className="w-full" loading={loading}>
            Criar conta
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-green-600">
            Entrar
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}

export default SignupPage
