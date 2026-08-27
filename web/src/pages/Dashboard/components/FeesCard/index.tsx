import { useQuery } from '@tanstack/react-query'
import { Spinner } from '../../../../components/atoms/Spinner'
import { feesService } from '../../../../services/fees/FeesService'

export function FeesCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['fees'],
    queryFn: () => feesService.getFees(),
  })

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <Spinner />
      </div>
    )
  }

  if (error) return null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-sm font-medium text-gray-600">Taxas do gateway</p>
        <span className="text-xs text-gray-500">{data?.total ?? 0} opções</span>
      </div>
      <div className="max-h-48 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-white text-gray-500">
            <tr>
              <th className="pb-2 font-medium">Bandeira</th>
              <th className="pb-2 font-medium">Parcelas</th>
              <th className="pb-2 font-medium">Taxa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {data?.fees.map((fee) => (
              <tr key={fee.id}>
                <td className="py-2 pr-4">{fee.brand}</td>
                <td className="py-2 pr-4">{fee.installments}x</td>
                <td className="py-2">
                  {fee.feePercentFormatted ?? `${fee.feePercent}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
