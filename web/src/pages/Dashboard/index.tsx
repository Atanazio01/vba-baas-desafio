import { useState } from 'react'
import { AppLayout } from '../../components/templates/AppLayout'
import { BalanceCard } from './components/BalanceCard'
import { TransactionFilters } from './components/TransactionFilters'
import { TransactionList } from './components/TransactionList'
import { PixLinkForm } from './components/PixLinkForm'
import { WithdrawalForm } from './components/WithdrawalForm'
import { FeesCard } from './components/FeesCard'
import type { PaymentStatus, WalletTransactionType } from '../../types/enums'

export function DashboardPage() {
  const [status, setStatus] = useState<PaymentStatus | ''>('')
  const [type, setType] = useState<WalletTransactionType | ''>('')

  return (
    <AppLayout>
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <BalanceCard />
        <FeesCard />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <PixLinkForm />
        <WithdrawalForm />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Transações</h2>
          <TransactionFilters
            status={status}
            type={type}
            onStatusChange={setStatus}
            onTypeChange={setType}
          />
        </div>
        <TransactionList status={status} type={type} />
      </section>
    </AppLayout>
  )
}

export default DashboardPage
