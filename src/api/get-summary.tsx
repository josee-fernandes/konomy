import { BanknoteArrowDown, BanknoteArrowUp, DollarSign } from 'lucide-react'

import type { ITransaction } from '@/@types/transaction'
import { LSDB } from '@/utils/db'

export async function getSummary() {
	const db = new LSDB()

	const transactions = db.select({ from: 'transactions' })

	return [
		{
			id: crypto.randomUUID(),
			category: 'your-balance',
			title: 'Em conta',
			icon: <DollarSign className="size-4" />,
			value: transactions.reduce((acc: number, transaction: ITransaction) => {
				if (transaction.type === 'income') {
					return acc + transaction.value
				}
				return acc
			}, 0),
		},
		{
			id: crypto.randomUUID(),
			category: 'expected-income',
			title: 'Entrada esperada',
			icon: <BanknoteArrowUp className="size-4" />,
			value: 12345,
		},
		{
			id: crypto.randomUUID(),
			category: 'current-expenses',
			title: 'Gastos atuais',
			icon: <BanknoteArrowDown className="size-4" />,
			value:
				transactions?.reduce((acc: number, transaction: ITransaction) => {
					if (transaction.type === 'expense') {
						return acc + transaction.value
					}
					return acc
				}, 0) || 0,
		},
	]
}
