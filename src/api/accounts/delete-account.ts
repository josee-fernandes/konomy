import { LSDB } from '@/utils/db'

export async function deleteAccount(id: string) {
	const db = new LSDB()

	db.delete({ from: 'accounts', id })
}
