import { db } from '@/lib/lsdb'

interface IGetTransactionParams {
	id: string
}

export async function getTransaction({ id }: IGetTransactionParams) {
	const transaction = await db.select({ from: 'transactions', where: { id } })

	if (!transaction) {
		throw new Error('Transaction not found')
	}

	return transaction
}
