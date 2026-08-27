export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  CHECKOUT: '/checkout/:publicId',
  NOT_FOUND: '*',
} as const

export function checkoutPath(publicId: string) {
  return `/checkout/${publicId}`
}
