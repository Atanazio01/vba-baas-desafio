import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 ${
        error ? 'border-red-600' : 'border-gray-200'
      } ${className}`}
      {...props}
    />
  )
}
