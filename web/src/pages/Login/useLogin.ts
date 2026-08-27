import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext/useAuth'
import { useErrors } from '../../hooks/useErrors'
import { gatewayService } from '../../services/gateway/GatewayService'
import { ROUTES } from '../../routes/paths'

export function useLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signin } = useAuth()
  const { error, setFromError, clearError } = useErrors()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      await signin(email, password)
      await queryClient.invalidateQueries({ queryKey: ['wallet-balance'] })
      await queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
      await queryClient.invalidateQueries({ queryKey: ['gateway-status'] })
      const status = await gatewayService.getStatus()
      navigate(status.connected ? ROUTES.DASHBOARD : ROUTES.ONBOARDING)
    } catch (err) {
      setFromError(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  }
}
