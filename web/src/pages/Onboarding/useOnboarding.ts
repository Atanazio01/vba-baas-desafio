import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext/useAuth'
import { useErrors } from '../../hooks/useErrors'
import { useGatewayStatus } from '../../hooks/useGatewayStatus'
import { gatewayService } from '../../services/gateway/GatewayService'
import { PersonType } from '../../types/enums'
import type { RegisterGatewayRequest } from '../../types/gateway'
import { ROUTES } from '../../routes/paths'

type Step = 'register' | 'connect'

const initialForm = (): RegisterGatewayRequest & { password: string } => ({
  personType: PersonType.PF,
  name: '',
  tradingName: '',
  email: '',
  phone: '',
  document: '',
  zipCode: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  password: '',
})

export function useOnboarding() {
  const { user } = useAuth()
  const { connected, loading: gatewayLoading } = useGatewayStatus()
  const [step, setStep] = useState<Step>('register')
  const [form, setForm] = useState(() => ({
    ...initialForm(),
    email: user?.email ?? '',
    name: user?.name ?? '',
  }))
  const [loading, setLoading] = useState(false)
  const { error, setFromError, clearError } = useErrors()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!gatewayLoading && connected) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [connected, gatewayLoading, navigate])

  function updateForm<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      const payload: RegisterGatewayRequest = {
        personType: form.personType,
        name: form.name,
        email: form.email,
        phone: form.phone,
        document: form.document,
        zipCode: form.zipCode,
        address: form.address,
        number: form.number,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
      }
      if (form.tradingName) payload.tradingName = form.tradingName
      if (form.complement) payload.complement = form.complement

      await gatewayService.register(payload)
      setStep('connect')
    } catch (err) {
      setFromError(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleConnect(e: FormEvent) {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      const status = await gatewayService.connect({
        document: form.document,
        password: form.password,
      })
      queryClient.setQueryData(['gateway-status'], status)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      setFromError(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    step,
    setStep,
    form,
    updateForm,
    loading: loading || gatewayLoading,
    error,
    handleRegister,
    handleConnect,
  }
}
