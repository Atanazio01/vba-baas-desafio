import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext/useAuth'
import { useErrors } from '../../hooks/useErrors'
import { ROUTES } from '../../routes/paths'

export function useSignup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const { error, setFromError, clearError } = useErrors()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      await signup(name, email, password)
      navigate(ROUTES.ONBOARDING)
    } catch (err) {
      setFromError(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  }
}
