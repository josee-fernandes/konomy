import { db } from '@/lib/lsdb'

export async function deleteTransaction(id: string) {
	await db.delete({ from: 'transactions', id })
}
