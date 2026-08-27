import { useCallback, useEffect, useState } from 'react'
import { checkoutService } from '../../services/checkout/CheckoutService'
import type { PublicCheckoutResponse } from '../../types/checkout'
import { PaymentStatus } from '../../types/enums'

export function usePublicCheckout(publicId: string) {
  const [data, setData] = useState<PublicCheckoutResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchCheckout = useCallback(async () => {
    try {
      const result = await checkoutService.getPublic(publicId)
      setData(result)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [publicId])

  useEffect(() => {
    void fetchCheckout()
  }, [fetchCheckout])

  useEffect(() => {
    if (!data || data.status === PaymentStatus.APPROVED) return

    const interval = setInterval(() => {
      void fetchCheckout()
    }, 5000)

    return () => clearInterval(interval)
  }, [data, fetchCheckout])

  async function copyEmv() {
    if (data?.pixEmv) await navigator.clipboard.writeText(data.pixEmv)
  }

  return { data, loading, error, copyEmv }
}
