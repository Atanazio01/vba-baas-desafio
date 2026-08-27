export type SigninRequest = {
  email: string
  password: string
}

export type SignupRequest = SigninRequest & {
  name: string
}

export type AuthResponse = {
  accessToken: string
}
