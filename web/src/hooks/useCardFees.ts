import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { feesService } from '../services/fees/FeesService'
import type { CardBrand } from '../types/enums'
import type { GatewayFee } from '../types/fees'

type Params = {
  brand: CardBrand | ''
  installments: number | ''
}

export function useCardFees({ brand, installments }: Params) {
  const query = useQuery({
    queryKey: ['fees', brand],
    queryFn: () => feesService.getFees(brand),
    enabled: !!brand,
  })

  const feesByInstallment = useMemo(() => {
    if (!query.data?.fees.length) return []
    return [...query.data.fees].sort((a, b) => a.installments - b.installments)
  }, [query.data?.fees])

  const selectedFee = useMemo((): GatewayFee | undefined => {
    if (!query.data?.fees.length || installments === '') return undefined
    return query.data.fees.find((fee) => fee.installments === installments)
  }, [query.data?.fees, installments])

  const canSubmit = !!brand && installments !== '' && !!selectedFee

  return {
    loading: !!brand && query.isLoading,
    error: query.error,
    feesByInstallment,
    selectedFee,
    feePercent: selectedFee?.feePercent ?? null,
    canSubmit,
  }
}
