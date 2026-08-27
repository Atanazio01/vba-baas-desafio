import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '../../services/auth/AuthService'
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
      clearToken()
      setUser(null)
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

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, signin, signup, logout, refreshMe }),
    [user, loading, signin, signup, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
