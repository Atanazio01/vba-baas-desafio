import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../../components/atoms/Button'
import { Input } from '../../../../components/atoms/Input'
import { FormField } from '../../../../components/molecules/FormField'
import { Modal } from '../../../../components/molecules/Modal'
import { PixPaymentDetails } from '../../../../components/molecules/PixPaymentDetails'
import { useErrors } from '../../../../hooks/useErrors'
import { checkoutService } from '../../../../services/checkout/CheckoutService'
import { checkoutPath } from '../../../../routes/paths'
import type { PixCheckoutResponse } from '../../../../types/checkout'
import { parseMoneyToCents } from '../../../../utils/formatMoney'

export function PixLinkForm() {
  const [amount, setAmount] = useState('')
  const [payerDocument, setPayerDocument] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdPix, setCreatedPix] = useState<PixCheckoutResponse | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [result, setResult] = useState<{ publicId: string; url: string } | null>(
    null,
  )
  const [emailSent, setEmailSent] = useState(false)
  const { error, setFromError, clearError } = useErrors()
  const queryClient = useQueryClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    setEmailSent(false)
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
    if (!result || !email) return
    setLoading(true)
    try {
      await checkoutService.sendEmail(result.publicId, { to: email })
      setEmailSent(true)
    } catch (err) {
      setFromError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Novo link Pix</h2>
        <form onSubmit={handleSubmit}>
          <FormField label="Valor (R$)" htmlFor="amount">
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10,00"
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

        {result && (
          <div className="mt-6 space-y-3 rounded-lg bg-gray-50 p-4">
            <p className="break-all text-sm text-gray-700">{result.url}</p>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Ver QR code
            </Button>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="E-mail do cliente"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="secondary" onClick={sendEmail} loading={loading}>
                Enviar e-mail
              </Button>
            </div>
            {emailSent && (
              <p className="text-sm text-green-600">E-mail enviado com sucesso!</p>
            )}
          </div>
        )}
      </div>

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
            <>
              <p className="mt-4 break-all text-xs text-gray-500">{result.url}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={copyLink}>
                  Copiar link
                </Button>
                <Button variant="secondary" onClick={whatsappShare}>
                  WhatsApp
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  )
}
