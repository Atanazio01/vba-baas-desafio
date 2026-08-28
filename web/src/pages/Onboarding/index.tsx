import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { FormField } from '../../components/molecules/FormField';
import { OnboardingLayout } from '../../components/templates/OnboardingLayout';
import { PersonType } from '../../types/enums';
import { useOnboarding } from './useOnboarding';

export function OnboardingPage() {
  const {
    step,
    setStep,
    form,
    updateForm,
    loading,
    error,
    handleRegister,
    handleConnect,
  } = useOnboarding()

  if (step === 'connect') {
    return (
      <OnboardingLayout
        title="Conectar ao Lera Box"
        subtitle="Use o documento e a senha recebidos por e-mail"
      >
        <form onSubmit={handleConnect}>
          <FormField label="CPF/CNPJ" htmlFor="document">
            <Input
              id="document"
              value={form.document}
              onChange={(e) => updateForm('document', e.target.value)}
              placeholder="Somente números"
              required
            />
          </FormField>
          <FormField label="Senha do e-mail Lera" htmlFor="password" error={error ?? undefined}>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateForm('password', e.target.value)}
              required
              error={!!error}
            />
          </FormField>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep('register')}>
              Voltar
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              Conectar
            </Button>
          </div>
        </form>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout
      title="Cadastro no Lera Box"
      subtitle="Registre sua conta no Lera Box"
    >
      <form onSubmit={handleRegister}>
        <FormField label="Tipo de pessoa" htmlFor="personType">
          <select
            id="personType"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
            value={form.personType}
            onChange={(e) => updateForm('personType', e.target.value as PersonType)}
          >
            <option value={PersonType.PF}>Pessoa Física</option>
            <option value={PersonType.PJ}>Pessoa Jurídica</option>
          </select>
        </FormField>
        <FormField label={form.personType === PersonType.PJ ? 'Razão social' : 'Nome completo'} htmlFor="name">
          <Input id="name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required />
        </FormField>
        {form.personType === PersonType.PJ && (
          <FormField label="Nome fantasia" htmlFor="tradingName">
            <Input id="tradingName" value={form.tradingName} onChange={(e) => updateForm('tradingName', e.target.value)} />
          </FormField>
        )}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="E-mail" htmlFor="email">
            <Input id="email" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required />
          </FormField>
          <FormField label="Celular" htmlFor="phone">
            <Input id="phone" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="11999998888" required />
          </FormField>
        </div>
        <FormField label="CPF/CNPJ" htmlFor="doc">
          <Input id="doc" value={form.document} onChange={(e) => updateForm('document', e.target.value)} required />
        </FormField>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="CEP" htmlFor="zipCode">
            <Input id="zipCode" value={form.zipCode} onChange={(e) => updateForm('zipCode', e.target.value)} required />
          </FormField>
          <FormField label="Estado" htmlFor="state">
            <Input id="state" value={form.state} onChange={(e) => updateForm('state', e.target.value.toUpperCase())} maxLength={2} required />
          </FormField>
          <FormField label="Cidade" htmlFor="city">
            <Input id="city" value={form.city} onChange={(e) => updateForm('city', e.target.value)} required />
          </FormField>
        </div>
        <FormField label="Endereço" htmlFor="address">
          <Input id="address" value={form.address} onChange={(e) => updateForm('address', e.target.value)} required />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Número" htmlFor="number">
            <Input id="number" value={form.number} onChange={(e) => updateForm('number', e.target.value)} required />
          </FormField>
          <FormField label="Complemento" htmlFor="complement">
            <Input id="complement" value={form.complement} onChange={(e) => updateForm('complement', e.target.value)} />
          </FormField>
        </div>
        <FormField label="Bairro" htmlFor="neighborhood">
          <Input id="neighborhood" value={form.neighborhood} onChange={(e) => updateForm('neighborhood', e.target.value)} required />
        </FormField>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>
          Registrar no Lera Box
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Já registrou?{' '}
        <button type="button" className="font-semibold text-green-600" onClick={() => setStep('connect')}>
          Conectar conta
        </button>
      </p>
    </OnboardingLayout>
  )
}

export default OnboardingPage
