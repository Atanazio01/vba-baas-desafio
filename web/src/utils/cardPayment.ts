import { CardBrand as CardBrandEnum, type CardBrand } from '../types/enums'

export const CARD_NUMBER_MAX_DIGITS = 16

const ELO_BIN_PREFIXES = [
  '4011',
  '4312',
  '4389',
  '4514',
  '4573',
  '5041',
  '5066',
  '5067',
  '509',
  '6277',
  '6362',
  '6363',
  '650',
  '6516',
  '6550',
] as const

export function formatCardNumberDisplay(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, CARD_NUMBER_MAX_DIGITS)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trimEnd()
}

function isEloPrefix(digits: string): boolean {
  return ELO_BIN_PREFIXES.some((prefix) => prefix.startsWith(digits))
}

export function isCardBrandPrefixValid(digits: string, brand: CardBrand): boolean {
  if (digits.length === 0) return true

  switch (brand) {
    case CardBrandEnum.VISA:
      return digits.startsWith('4')
    case CardBrandEnum.MASTERCARD:
      if (digits.startsWith('5')) {
        return digits.length === 1 || (digits[1] >= '1' && digits[1] <= '5')
      }
      if (digits.startsWith('2')) {
        return digits.length === 1 || (digits[1] >= '2' && digits[1] <= '7')
      }
      return false
    case CardBrandEnum.ELO:
      return isEloPrefix(digits)
    default:
      return false
  }
}

export function isCardNumberComplete(digits: string): boolean {
  return digits.length === CARD_NUMBER_MAX_DIGITS
}

export function getCardNumberError(
  digits: string,
  brand: CardBrand | '',
): string | null {
  if (!brand || digits.length === 0) return null

  if (!isCardBrandPrefixValid(digits, brand)) {
    return 'Número do cartão inválido'
  }

  return null
}

export function getInstallmentCents(
  amountCents: number,
  installments: number,
): number {
  if (installments < 1) return amountCents
  return Math.round(amountCents / installments)
}

export function formatInstallmentLabel(installments: number): string {
  if (installments <= 1) return 'À vista'
  return `${installments}x`
}
