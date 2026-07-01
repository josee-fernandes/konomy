import { LSDB } from '@/utils/db'

export async function deleteTransaction(id: string) {
	const db = new LSDB()

	db.delete({ from: 'transactions', id })
}
