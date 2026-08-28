import type { ReactNode } from 'react'
import { Logo } from '../../atoms/Logo'

type AuthCardProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
      <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mb-8 text-center text-sm text-gray-600">{subtitle}</p>
      )}
      {!subtitle && <div className="mb-8" />}
      {children}
    </div>
  )
}
