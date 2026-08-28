import { useCallback, useState } from 'react'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

export function useErrors() {
  const [error, setError] = useState<string | null>(null)

  const setFromError = useCallback((err: unknown) => {
    setError(getApiErrorMessage(err))
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { error, setError, setFromError, clearError }
}
