import type { InputHTMLAttributes } from 'react'
import { Input } from '../Input'
import { formatCurrencyInput } from '../../../utils/formatMoney'

type MoneyInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function MoneyInput({
  value,
  onChange,
  placeholder = 'R$ 0,00',
  inputMode = 'decimal',
  ...props
}: MoneyInputProps) {
  return (
    <Input
      {...props}
      value={value}
      placeholder={placeholder}
      inputMode={inputMode}
      onChange={(e) => onChange(formatCurrencyInput(e.target.value))}
    />
  )
}
