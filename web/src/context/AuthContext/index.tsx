import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth/AuthService'
import { registerSessionExpiredHandler } from '../../services/http/session'
import { ROUTES } from '../../routes/paths'
import { clearToken, getToken, setToken } from '../../utils/storage'
import type { UserProfile } from '../../types/user'

type AuthContextValue = {
  user: UserProfile | null
  loading: boolean
  signin: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  useEffect(() => {
    return registerSessionExpiredHandler(() => {
      logout()
      navigate(ROUTES.LOGIN, { replace: true })
    })
  }, [logout, navigate])

  const refreshMe = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const profile = await authService.getMe()
      setUser(profile)
    } catch {
      if (!getToken()) {
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshMe()
  }, [refreshMe])

  const signin = useCallback(async (email: string, password: string) => {
    const { accessToken } = await authService.signin({ email, password })
    setToken(accessToken)
    const profile = await authService.getMe()
    setUser(profile)
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const { accessToken } = await authService.signup({ name, email, password })
      setToken(accessToken)
      const profile = await authService.getMe()
      setUser(profile)
    },
    [],
  )

  const value = useMemo(
    () => ({ user, loading, signin, signup, logout, refreshMe }),
    [user, loading, signin, signup, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
