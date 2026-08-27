type SessionExpiredHandler = () => void

let sessionExpiredHandler: SessionExpiredHandler | null = null

export function registerSessionExpiredHandler(handler: SessionExpiredHandler) {
  sessionExpiredHandler = handler

  return () => {
    if (sessionExpiredHandler === handler) {
      sessionExpiredHandler = null
    }
  }
}

export function notifySessionExpired() {
  sessionExpiredHandler?.()
}

export function isSessionExpiredRequest(url: string | undefined): boolean {
  if (!url) return false
  return url.includes('/users/me')
}

export function isAuthAttemptRequest(url: string | undefined): boolean {
  if (!url) return false
  return url.includes('/auth/signin') || url.includes('/auth/signup')
}
