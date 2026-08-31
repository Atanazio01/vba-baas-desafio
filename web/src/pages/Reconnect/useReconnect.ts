import { useQueryClient } from '@tanstack/react-query';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrors } from '../../hooks/useErrors';
import { ROUTES } from '../../routes/paths';
import { gatewayService } from '../../services/gateway/GatewayService';

export function useReconnect() {
  const [document, setDocument] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { error, setFromError, clearError } = useErrors()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      const status = await gatewayService.reconnect({ document, password })
      queryClient.setQueryData(['gateway-status'], status)
      await queryClient.invalidateQueries({ queryKey: ['wallet-balance'] })
      await queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      setFromError(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    document,
    setDocument,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  }
}
