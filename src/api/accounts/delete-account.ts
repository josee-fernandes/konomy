import { db } from '@/lib/lsdb'

export async function deleteAccount(id: string) {
	await db.delete({ from: 'accounts', id })
}
