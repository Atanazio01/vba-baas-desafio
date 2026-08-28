import { useParams } from 'react-router-dom'
import { Spinner } from '../../components/atoms/Spinner'
import { CardPaymentDetails } from '../../components/molecules/CardPaymentDetails'
import { PixPaymentDetails } from '../../components/molecules/PixPaymentDetails'
import { PaymentMethod } from '../../types/enums'
import { usePublicCheckout } from './usePublicCheckout'

export function PublicCheckoutPage() {
  const { publicId = '' } = useParams()
  const { data, loading, error, copyEmv } = usePublicCheckout(publicId)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Link de pagamento não encontrado.</p>
        </div>
      </div>
    )
  }

  const title =
    data.method === PaymentMethod.CARD ? 'Comprovante cartão' : 'Pagamento Pix'

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">{title}</h1>
        {data.method === PaymentMethod.CARD ? (
          <CardPaymentDetails
            amountCents={data.amountCents}
            status={data.status}
            brand={data.brand}
            installments={data.installments}
            feePercent={data.feePercent}
          />
        ) : (
          <PixPaymentDetails
            amountCents={data.amountCents}
            status={data.status}
            pixEmv={data.pixEmv}
            pixQrBase64={data.pixQrBase64}
            onCopyEmv={copyEmv}
          />
        )}
      </div>
    </div>
  )
}

export default PublicCheckoutPage
