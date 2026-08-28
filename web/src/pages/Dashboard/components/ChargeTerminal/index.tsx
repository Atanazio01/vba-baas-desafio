import { useState } from 'react';
import { CardPaymentForm } from '../CardPaymentForm';
import { PixLinkForm } from '../PixLinkForm';

type ChargeMode = 'pix' | 'card'

const tabs: { id: ChargeMode; label: string }[] = [
  { id: 'pix', label: 'Pix' },
  { id: 'card', label: 'Cartão' },
]

export function ChargeTerminal() {
  const [mode, setMode] = useState<ChargeMode>('pix')

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Terminal de cobrança</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gere cobranças Pix ou crie um link de pagamento para cartão.
        </p>
        <div className="mt-4 inline-flex rounded-lg bg-gray-200/80 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`rounded-md px-5 py-2 text-sm font-semibold transition-colors ${
                mode === tab.id
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {mode === 'pix' ? <PixLinkForm embedded /> : <CardPaymentForm embedded />}
      </div>
    </section>
  )
}
