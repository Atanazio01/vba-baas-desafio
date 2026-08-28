export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-sm font-bold text-white">
        B
      </div>
      <span className="text-lg font-bold text-gray-900">BaaS</span>
    </div>
  )
}
