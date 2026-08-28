import { useQueryClient } from '@tanstack/react-query';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '../../../../components/atoms/Button';
import { Input } from '../../../../components/atoms/Input';
import { MoneyInput } from '../../../../components/atoms/MoneyInput';
import { FormField } from '../../../../components/molecules/FormField';
import { StatusBadge } from '../../../../components/molecules/StatusBadge';
import { withdrawalService } from '../../../../services/withdrawal/WithdrawalService';
import { formatMoney, parseMoneyToCents } from '../../../../utils/formatMoney';
import { getApiErrorMessage } from '../../../../utils/getApiErrorMessage';

export function WithdrawalForm({ embedded = false }: { embedded?: boolean }) {
  const [amount, setAmount] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [document, setDocument] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Awaited<
    ReturnType<typeof withdrawalService.create>
  > | null>(null)
  const queryClient = useQueryClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const result = await withdrawalService.create({
        amountCents: parseMoneyToCents(amount),
        pixKey,
        document,
        description: description || undefined,
      })
      setSuccess(result)
      await queryClient.invalidateQueries({ queryKey: ['wallet-balance'] })
      await queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const form = (
    <form onSubmit={handleSubmit}>
        <FormField label="Valor" htmlFor="w-amount">
          <MoneyInput id="w-amount" value={amount} onChange={setAmount} required />
        </FormField>
        <FormField label="Chave Pix" htmlFor="pixKey">
          <Input id="pixKey" value={pixKey} onChange={(e) => setPixKey(e.target.value)} required />
        </FormField>
        <FormField label="CPF titular" htmlFor="w-document">
          <Input id="w-document" value={document} onChange={(e) => setDocument(e.target.value)} required />
        </FormField>
        <FormField label="Descrição (opcional)" htmlFor="w-desc">
          <Input id="w-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormField>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Solicitar saque
        </Button>
    </form>
  )

  const successBlock = success && (
    <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm">
      <p className="font-medium text-green-800">
        Saque de {formatMoney(success.amountCents)} solicitado
      </p>
      <div className="mt-2">
        <StatusBadge status={success.status} />
      </div>
    </div>
  )

  if (embedded) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Saque</h2>
        <p className="mb-4 text-sm text-gray-500">Transferências via Pix.</p>
        {form}
        {successBlock}
      </section>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Saque</h2>
      {form}
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {successBlock}
    </div>
  )
}
