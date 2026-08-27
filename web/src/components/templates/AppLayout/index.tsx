import type { ReactNode } from 'react'
import { AppHeader } from '../../organisms/AppHeader'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
