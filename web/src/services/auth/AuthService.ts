import { http } from '../http/HttpClient'
import type { AuthResponse, SigninRequest, SignupRequest } from '../../types/auth'
import type { UserProfile } from '../../types/user'

class AuthService {
  signin(data: SigninRequest) {
    return http.post<AuthResponse>('/auth/signin', data).then((r) => r.data)
  }

  signup(data: SignupRequest) {
    return http.post<AuthResponse>('/auth/signup', data).then((r) => r.data)
  }

  getMe() {
    return http.get<UserProfile>('/users/me').then((r) => r.data)
  }
}

export const authService = new AuthService()
