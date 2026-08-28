import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../../components/atoms/Button'
import { MoneyInput } from '../../../../components/atoms/MoneyInput'
import { Input } from '../../../../components/atoms/Input'
import { FormField } from '../../../../components/molecules/FormField'
import { CardPaymentDetails } from '../../../../components/molecules/CardPaymentDetails'
import { Modal } from '../../../../components/molecules/Modal'
import { useCardFees } from '../../../../hooks/useCardFees'
import { useErrors } from '../../../../hooks/useErrors'
import { checkoutService } from '../../../../services/checkout/CheckoutService'
import { checkoutPath } from '../../../../routes/paths'
import type { CardCheckoutResponse } from '../../../../types/checkout'
import { CardBrand } from '../../../../types/enums'
import {
  formatCardNumberDisplay,
  formatInstallmentLabel,
  getCardNumberError,
  getInstallmentCents,
  isCardNumberComplete,
} from '../../../../utils/cardPayment'
import { formatMoney, parseMoneyToCents } from '../../../../utils/formatMoney'

const brandOptions = [
  { value: CardBrand.VISA, label: 'Visa' },
  { value: CardBrand.MASTERCARD, label: 'Mastercard' },
  { value: CardBrand.ELO, label: 'Elo' },
] as const

export function CardPaymentForm({ embedded = false }: { embedded?: boolean }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [brand, setBrand] = useState<CardBrand | ''>('')
  const [installments, setInstallments] = useState<number | ''>('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdCard, setCreatedCard] = useState<CardCheckoutResponse | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const { error, setFromError, clearError } = useErrors()
  const queryClient = useQueryClient()

  const amountCents = useMemo(() => parseMoneyToCents(amount), [amount])
  const cardDigits = useMemo(() => cardNumber.replace(/\D/g, ''), [cardNumber])
  const cardNumberError = useMemo(
    () => getCardNumberError(cardDigits, brand),
    [cardDigits, brand],
  )

  const { loading: feesLoading, feesByInstallment, selectedFee, canSubmit } =
    useCardFees({ brand, installments })

  const installmentCents =
    installments !== '' && amountCents > 0
      ? getInstallmentCents(amountCents, Number(installments))
      : 0

  function handleBrandChange(value: string) {
    setBrand(value as CardBrand)
    setInstallments('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    if (!selectedFee || brand === '' || installments === '' || amountCents < 1) return
    if (cardNumberError || !isCardNumberComplete(cardDigits)) return

    setLoading(true)
    try {
      const data = await checkoutService.createCard({
        amountCents,
        brand,
        installments: Number(installments),
        feePercent: selectedFee.feePercent,
        cardNumber: cardDigits,
        cardHolder: cardHolder.trim().toUpperCase(),
        expiryMonth,
        expiryYear,
        cvv,
        description: description || undefined,
      })
      const url = `${window.location.origin}${checkoutPath(data.publicId)}`
      setCreatedCard(data)
      setReceiptUrl(url)
      setModalOpen(true)
      await queryClient.invalidateQueries({ queryKey: ['wallet-balance'] })
      await queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
    } catch (err) {
      setFromError(err)
    } finally {
      setLoading(false)
    }
  }

  async function copyReceiptUrl() {
    if (receiptUrl) await navigator.clipboard.writeText(receiptUrl)
  }

  const showSummary =
    !!selectedFee && amountCents > 0 && installments !== ''

  const form = (
    <form onSubmit={handleSubmit}>
          <FormField label="Valor" htmlFor="card-amount">
            <MoneyInput
              id="card-amount"
              value={amount}
              onChange={setAmount}
              required
            />
          </FormField>
          <FormField label="Descrição (opcional)" htmlFor="card-description">
            <Input
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Bandeira" htmlFor="card-brand">
              <select
                id="card-brand"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                value={brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                {brandOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Parcelas" htmlFor="card-installments">
              <select
                id="card-installments"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm disabled:bg-gray-50"
                value={installments === '' ? '' : String(installments)}
                onChange={(e) =>
                  setInstallments(e.target.value ? Number(e.target.value) : '')
                }
                disabled={!brand || feesLoading}
                required
              >
                <option value="">
                  {feesLoading ? 'Carregando...' : 'Selecione'}
                </option>
                {feesByInstallment.map((fee) => (
                  <option key={fee.installments} value={fee.installments}>
                    {fee.installments}x — {fee.feePercentFormatted}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {showSummary && (
            <div className="mb-4 space-y-2 rounded-lg border border-navy-900/10 bg-navy-900/5 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Taxa</span>
                <span className="font-medium text-gray-900">
                  {selectedFee.feePercentFormatted}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Valor final</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatMoney(amountCents)}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-gray-200 pt-2">
                <span className="text-gray-600">Parcelamento</span>
                <span className="font-semibold text-green-700">
                  {Number(installments) > 1
                    ? `${formatInstallmentLabel(Number(installments))} de ${formatMoney(installmentCents)}`
                    : 'À vista'}
                </span>
              </div>
            </div>
          )}

          <FormField
            label="Número do cartão"
            htmlFor="card-number"
            error={cardNumberError ?? undefined}
          >
            <Input
              id="card-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumberDisplay(e.target.value))}
              placeholder="1234 5678 9101 1121"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={19}
              error={!!cardNumberError}
              className="!w-[calc(20ch+1.75rem)] max-w-full overflow-hidden font-mono text-xs tabular-nums tracking-normal sm:text-sm"
              required
            />
          </FormField>
          <FormField label="Nome no cartão" htmlFor="card-holder">
            <Input
              id="card-holder"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="MARIA SILVA"
              required
            />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Mês" htmlFor="card-month">
              <Input
                id="card-month"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                placeholder="12"
                maxLength={2}
                inputMode="numeric"
                required
              />
            </FormField>
            <FormField label="Ano" htmlFor="card-year">
              <Input
                id="card-year"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                placeholder="2030"
                maxLength={4}
                inputMode="numeric"
                required
              />
            </FormField>
            <FormField label="CVV" htmlFor="card-cvv">
              <Input
                id="card-cvv"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={4}
                inputMode="numeric"
                required
              />
            </FormField>
          </div>

          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            loading={loading}
            disabled={
              !canSubmit ||
              amountCents < 1 ||
              !!cardNumberError ||
              !isCardNumberComplete(cardDigits)
            }
          >
            Cobrar cartão
        </Button>
    </form>
  )

  return (
    <>
      {embedded ? (
        form
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Cobrança no cartão</h2>
          <p className="mb-4 text-sm text-gray-500">
            Valor, bandeira, parcelas e dados do cartão. Taxa via gateway.
          </p>
          {form}
        </div>
      )}

      {createdCard && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Resultado da cobrança"
        >
          <CardPaymentDetails
            amountCents={createdCard.amountCents}
            status={createdCard.status}
            brand={createdCard.brand}
            installments={createdCard.installments}
            feePercent={createdCard.feePercent}
          />
          {receiptUrl && (
            <>
              <p className="mt-4 break-all text-xs text-gray-500">{receiptUrl}</p>
              <Button variant="secondary" className="mt-3 w-full" onClick={copyReceiptUrl}>
                Copiar comprovante
              </Button>
            </>
          )}
        </Modal>
      )}
    </>
  )
}
