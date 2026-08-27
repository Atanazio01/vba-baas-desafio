export function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function parseMoneyToCents(value: string): number {
  const normalized = value.replace(/[^\d,]/g, '').replace(',', '.')
  const amount = parseFloat(normalized)
  if (Number.isNaN(amount)) return 0
  return Math.round(amount * 100)
}
