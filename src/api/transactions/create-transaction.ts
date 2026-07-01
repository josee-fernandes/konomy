import type { ITransaction } from '@/@types/transaction'
import { db } from '@/lib/lsdb'

interface ICreateTransactionParams extends Omit<ITransaction, 'id' | 'createdAt' | 'updatedAt'> {}

export async function createTransaction(data: ICreateTransactionParams) {
	const transaction = await db.insert({ into: 'transactions', data })

	return transaction
}
