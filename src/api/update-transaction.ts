import type { ITransaction } from '@/@types/transaction'
import { LSDB } from '@/utils/db'

interface IUpdateTransactionParams extends ITransaction {}

export async function updateTransaction(data: IUpdateTransactionParams) {
	const db = new LSDB()

	const transaction = db.update({ from: 'transactions', where: { id: data.id }, data })

	return transaction as ITransaction
}
