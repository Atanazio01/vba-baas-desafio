export type GatewayFee = {
  id: string
  brand: string
  installments: number
  feePercent: number
  feePercentFormatted: string
}

export type GatewayFeesResponse = {
  total: number
  fees: GatewayFee[]
}
