import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../../components/atoms/Button'
import { MoneyInput } from '../../../../components/atoms/MoneyInput'
import { Input } from '../../../../components/atoms/Input'
import { FormField } from '../../../../components/molecules/FormField'
import { Modal } from '../../../../components/molecules/Modal'
import { PixPaymentDetails } from '../../../../components/molecules/PixPaymentDetails'
import { useAuth } from '../../../../context/AuthContext/useAuth'
import { useErrors } from '../../../../hooks/useErrors'
import { checkoutService } from '../../../../services/checkout/CheckoutService'
import { checkoutPath } from '../../../../routes/paths'
import type { PixCheckoutResponse } from '../../../../types/checkout'
import { parseMoneyToCents } from '../../../../utils/formatMoney'
import { getApiErrorMessage } from '../../../../utils/getApiErrorMessage'

export function PixLinkForm({ embedded = false }: { embedded?: boolean }) {
  const [amount, setAmount] = useState('')
  const [payerDocument, setPayerDocument] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdPix, setCreatedPix] = useState<PixCheckoutResponse | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [result, setResult] = useState<{ publicId: string; url: string } | null>(
    null,
  )
  const [emailSent, setEmailSent] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const { error, setFromError, clearError } = useErrors()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    setEmailSent(false)
    setEmailError(null)
    setLoading(true)
    try {
      const data = await checkoutService.createPix({
        amountCents: parseMoneyToCents(amount),
        payerDocument,
        description: description || undefined,
      })
      const url = `${window.location.origin}${checkoutPath(data.publicId)}`
      setCreatedPix(data)
      setModalOpen(true)
      setResult({ publicId: data.publicId, url })
      await queryClient.invalidateQueries({ queryKey: ['wallet-balance'] })
      await queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
    } catch (err) {
      setFromError(err)
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (result) await navigator.clipboard.writeText(result.url)
  }

  function whatsappShare() {
    if (!result) return
    const text = encodeURIComponent(`Link de pagamento: ${result.url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  async function copyEmv() {
    if (createdPix?.pixEmv) await navigator.clipboard.writeText(createdPix.pixEmv)
  }

  async function sendEmail() {
    if (!result || !user?.email) return
    setEmailError(null)
    setEmailSending(true)
    try {
      await checkoutService.sendEmail(result.publicId, { to: user.email })
      setEmailSent(true)
    } catch (err) {
      setEmailError(getApiErrorMessage(err))
    } finally {
      setEmailSending(false)
    }
  }

  const form = (
    <>
        <form onSubmit={handleSubmit}>
          <FormField label="Valor" htmlFor="amount">
            <MoneyInput
              id="amount"
              value={amount}
              onChange={setAmount}
              required
            />
          </FormField>
          <FormField label="CPF/CNPJ do pagador" htmlFor="payerDocument">
            <Input
              id="payerDocument"
              value={payerDocument}
              onChange={(e) => setPayerDocument(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Descrição (opcional)" htmlFor="description">
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading}>
            Gerar link
          </Button>
        </form>
    </>
  )

  return (
    <>
      {embedded ? (
        form
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Novo link Pix</h2>
          {form}
        </div>
      )}

      {createdPix && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Cobrança Pix gerada"
        >
          <PixPaymentDetails
            amountCents={createdPix.amountCents}
            status={createdPix.status}
            pixEmv={createdPix.pixEmv}
            pixQrBase64={createdPix.pixQrBase64}
            onCopyEmv={copyEmv}
          />
          {result && (
            <div className="mt-6 space-y-5 border-t border-gray-100 pt-6">
              <div className="space-y-3">
                <p className="break-all text-xs text-gray-500">{result.url}</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={copyLink}>
                    Copiar link
                  </Button>
                  <Button variant="secondary" onClick={whatsappShare}>
                    WhatsApp
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={sendEmail}
                    loading={emailSending}
                    disabled={!user?.email}
                  >
                    Enviar para meu e-mail
                  </Button>
                </div>
                {emailSent && (
                  <p className="text-sm text-green-600">E-mail enviado com sucesso!</p>
                )}
                {emailError && (
                  <p className="text-sm text-red-600">{emailError}</p>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
