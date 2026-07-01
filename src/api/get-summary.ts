import { db } from '@/lib/lsdb'

interface IGetSummaryParams {
	userId: string
}

export interface ISummaryItem {
	id: string
	category: 'balance' | 'expected-income' | 'expenses'
	title: string
	value: number
}

export async function getSummary({ userId }: IGetSummaryParams) {
	const transactions = await db.select({ from: 'transactions' })
	const accounts = await db.select({ from: 'accounts', where: { userId } })

	return [
		{
			id: crypto.randomUUID(),
			category: 'balance',
			title: 'Saldo total',
			value: accounts.reduce((accumulator, account) => {
				if (account.currency === 'BRL') {
					return accumulator + account.balance
				}
				return accumulator + 0 // TODO: different currencies
			}, 0),
		},
		{
			id: crypto.randomUUID(),
			category: 'expected-income',
			title: 'Entrada esperada',
			value: 12345,
		},
		{
			id: crypto.randomUUID(),
			category: 'expenses',
			title: 'Gastos atuais',
			value:
				transactions?.reduce((accumulator, transaction) => {
					if (transaction.type === 'expense') {
						return accumulator + transaction.value
					}
					return accumulator
				}, 0) || 0,
		},
	] as ISummaryItem[]
}
