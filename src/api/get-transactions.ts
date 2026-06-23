import type { ITransaction } from '@/@types/transaction'
import { LSDB } from '@/utils/db'

// const transtactions = [
//   {
//     id: crypto.randomUUID(),
//     description: 'Compra de roupas',
//     value: 100.0,
//     date: new Date('2026-06-23').toISOString(),
//     type: 'expense',
//     category: 'clothing',
//     subcategory: 'clothes',
//     paymentMethod: 'credit card',
//     installments: {
//       id: crypto.randomUUID(),
//       total: 1,
//       current: 1,
//       value: 100.0,
//     },
//     origin: {
//       id: crypto.randomUUID(),
//       type: 'credit-card',
//       name: 'Itaú',
//       logo: <CreditCard className="size-4 text-primary" />,
//     },
//   },
//   {
//     id: crypto.randomUUID(),
//     description: 'Dívida Layane',
//     value: 500.0,
//     date: new Date('2026-06-20').toISOString(),
//     type: 'expense',
//     category: 'other',
//     subcategory: 'other',
//     paymentMethod: 'pix',
//     origin: {
//       id: crypto.randomUUID(),
//       type: 'pix',
//       name: 'Pix',
//       logo: <QrCode className="size-4 text-primary" />,
//     },
//   },
// ]

export async function getTransactions() {
	const db = new LSDB()

	const transactions = db.select({ from: 'transactions' })

	return transactions as ITransaction[]
}
