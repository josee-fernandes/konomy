import type { ITransaction } from '@/@types/transaction'
import { db } from '@/lib/lsdb'

interface ICreateTransactionParams extends Omit<ITransaction, 'id' | 'createdAt' | 'updatedAt'> {}

export async function createTransaction(data: ICreateTransactionParams) {
	const transaction = await db.insert({ into: 'transactions', data })

	const account = (await db.select({ from: 'accounts', where: { id: data.accountId } }))[0]

	const updatedBalance = transaction.type === 'income' ? account.balance + data.value : account.balance - data.value

	await db.update({
		from: 'accounts',
		where: { id: account.id },
		data: { balance: updatedBalance },
	})

	return transaction
}
