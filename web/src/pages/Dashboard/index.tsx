import { useState } from 'react'
import { AppLayout } from '../../components/templates/AppLayout'
import { TransactionFilters } from './components/TransactionFilters'
import { TransactionList } from './components/TransactionList'
import { ChargeTerminal } from './components/ChargeTerminal'
import { WithdrawalForm } from './components/WithdrawalForm'
import { MerchantBalanceBanner } from './components/MerchantBalanceBanner'
import type { PaymentStatus, WalletTransactionType } from '../../types/enums'

export function DashboardPage() {
  const [status, setStatus] = useState<PaymentStatus | ''>('')
  const [type, setType] = useState<WalletTransactionType | ''>('')
  const [transactionCount, setTransactionCount] = useState(0)

  return (
    <AppLayout>
      <div className="mb-8">
        <MerchantBalanceBanner />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChargeTerminal />
        </div>
        <WithdrawalForm embedded />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Extrato</h2>
              <p className="mt-1 text-sm text-gray-500">
                Movimentações da sua carteira
              </p>
            </div>
            <TransactionFilters
              status={status}
              type={type}
              onStatusChange={setStatus}
              onTypeChange={setType}
            />
          </div>
        </div>
        <div className="max-h-[min(50vh,22rem)] overflow-y-auto overscroll-contain px-6 sm:max-h-[28rem]">
          <TransactionList
            status={status}
            type={type}
            onCountChange={setTransactionCount}
          />
        </div>
        {transactionCount > 5 && (
          <p className="border-t border-gray-100 px-6 py-3 text-center text-xs text-gray-400">
            Role para ver mais movimentações
          </p>
        )}
      </section>
    </AppLayout>
  )
}

export default DashboardPage
