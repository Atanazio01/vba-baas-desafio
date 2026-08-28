import type { ReactNode } from 'react'
import { Logo } from '../../atoms/Logo'

export function OnboardingLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mb-8 text-center text-sm text-gray-600">{subtitle}</p>
        )}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
