import type { ITransaction } from '@/@types/transaction'
import { LSDB } from '@/utils/db'

interface IGetTransactionParams {
	id: string
}

export async function getTransaction({ id }: IGetTransactionParams) {
	const db = new LSDB()

	const transaction = db.select({ from: 'transactions', where: { id } })

	if (!transaction) {
		throw new Error('Transaction not found')
	}

	return transaction as ITransaction
}
