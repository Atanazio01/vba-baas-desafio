import { Button } from '../../components/atoms/Button'
import { Input } from '../../components/atoms/Input'
import { AuthCard } from '../../components/molecules/AuthCard'
import { FormField } from '../../components/molecules/FormField'
import { AuthLayout } from '../../components/templates/AuthLayout'
import { useReconnect } from './useReconnect'

export function ReconnectPage() {
  const {
    document,
    setDocument,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useReconnect()

  return (
    <AuthLayout>
      <AuthCard
        title="Reconectar Lera Box"
        subtitle="Seu token expirou. Informe documento e senha do gateway."
      >
        <form onSubmit={handleSubmit}>
          <FormField label="CPF/CNPJ" htmlFor="document">
            <Input
              id="document"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              placeholder="Somente números"
              required
            />
          </FormField>
          <FormField
            label="Senha do e-mail Lera"
            htmlFor="password"
            error={error ?? undefined}
          >
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!!error}
            />
          </FormField>
          <Button type="submit" className="w-full" loading={loading}>
            Reconectar
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

export default ReconnectPage
