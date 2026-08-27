import { useParams } from 'react-router-dom'
import { usePublicCheckout } from './usePublicCheckout'
import { Spinner } from '../../components/atoms/Spinner'
import { StatusBadge } from '../../components/molecules/StatusBadge'
import { Button } from '../../components/atoms/Button'
import { formatMoney } from '../../utils/formatMoney'
import { PaymentStatus } from '../../types/enums'

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

  const isPaid = data.status === PaymentStatus.APPROVED

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Pagamento Pix</h1>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {formatMoney(data.amountCents)}
          </p>
          <div className="mt-3 flex justify-center">
            <StatusBadge status={data.status} />
          </div>
        </div>

        {!isPaid && data.pixQrBase64 && (
          <div className="mb-6 flex justify-center">
            <img
              src={`data:image/png;base64,${data.pixQrBase64}`}
              alt="QR Code Pix"
              className="h-48 w-48 rounded-lg border border-gray-200"
            />
          </div>
        )}

        {!isPaid && data.pixEmv && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-gray-600">
              Pix copia e cola
            </p>
            <p className="break-all rounded-lg bg-gray-50 p-3 text-xs text-gray-800">
              {data.pixEmv}
            </p>
            <Button variant="secondary" className="mt-3 w-full" onClick={copyEmv}>
              Copiar código
            </Button>
          </div>
        )}

        {isPaid && (
          <div className="text-center">
            <p className="mb-4 text-green-700">Pagamento confirmado!</p>
            <Button variant="secondary" className="w-full" onClick={() => window.print()}>
              Imprimir comprovante
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicCheckoutPage
