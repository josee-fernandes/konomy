import type { ITransaction } from '@/@types/transaction'
import { db } from '@/lib/lsdb'

interface IUpdateTransactionParams extends Omit<ITransaction, 'createdAt' | 'updatedAt'> {}

export async function updateTransaction(data: IUpdateTransactionParams) {
	const transaction = await db.update({ from: 'transactions', where: { id: data.id }, data })

	return transaction
}
