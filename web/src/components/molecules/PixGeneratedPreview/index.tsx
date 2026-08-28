import { Button } from '../../atoms/Button'
import { formatMoney } from '../../../utils/formatMoney'
import { getPixQrImageSrc } from '../../../utils/pixQr'

type Props = {
  amountCents: number
  pixEmv?: string | null
  pixQrBase64?: string | null
  onCopyEmv?: () => void
}

export function PixGeneratedPreview({
  amountCents,
  pixEmv,
  pixQrBase64,
  onCopyEmv,
}: Props) {
  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-3xl font-bold text-green-600">{formatMoney(amountCents)}</p>
        <p className="mt-3 text-sm text-gray-600">
          Compartilhe o link para o pagador concluir o Pix.
        </p>
      </div>

      {pixQrBase64 && (
        <div className="mb-6 flex justify-center">
          <img
            src={getPixQrImageSrc(pixQrBase64)}
            alt="QR Code Pix"
            className="h-48 w-48 rounded-lg border border-gray-200"
          />
        </div>
      )}

      {pixEmv && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-gray-600">Pix copia e cola</p>
          <p className="break-all rounded-lg bg-gray-50 p-3 text-xs text-gray-800">
            {pixEmv}
          </p>
          {onCopyEmv && (
            <Button variant="secondary" className="mt-3 w-full" onClick={onCopyEmv}>
              Copiar código
            </Button>
          )}
        </div>
      )}
    </>
  )
}
