import { useQuery } from '@tanstack/react-query'
import { feesService } from '../../../../services/fees/FeesService'
import { Spinner } from '../../../../components/atoms/Spinner'

export function FeesCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['fees'],
    queryFn: () => feesService.getFees(),
  })

  if (isLoading) return <Spinner className="h-5 w-5" />
  if (error) return null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs text-gray-600 shadow-sm">
      <p className="mb-1 font-semibold text-gray-900">Taxas do gateway</p>
      <pre className="overflow-auto whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
