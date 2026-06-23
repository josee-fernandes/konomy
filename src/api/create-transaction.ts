import type { ITransaction } from '@/@types/transaction'
import { LSDB } from '@/utils/db'

interface ICreateTransactionParams extends Omit<ITransaction, 'id'> {}

export async function createTransaction(data: ICreateTransactionParams) {
	const db = new LSDB()

	const transaction = db.insert({ into: 'transactions', data })

	return transaction as ITransaction
}
