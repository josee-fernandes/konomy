import type { IAccount } from '@/@types/account'
import type { ITransaction } from '@/@types/transaction'
import { LSDB } from '@/utils/db'

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
	const db = new LSDB()

	const transactions = db.select({ from: 'transactions' })
	const accounts = db.select({ from: 'accounts', where: { userId } })

	return [
		{
			id: crypto.randomUUID(),
			category: 'balance',
			title: 'Saldo total',
			value: accounts.reduce((acc: number, account: IAccount) => {
				if (account.currency === 'BRL') {
					return acc + account.balance
				}
				return acc + 0 // TODO: different currencies
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
				transactions?.reduce((acc: number, transaction: ITransaction) => {
					if (transaction.type === 'expense') {
						return acc + transaction.value
					}
					return acc
				}, 0) || 0,
		},
	] as ISummaryItem[]
}
