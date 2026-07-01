import type { IAccount } from '@/@types/account'
import { db } from '@/lib/lsdb'

interface IUpdateAccountParams extends Omit<IAccount, 'createdAt' | 'updatedAt'> {}

export async function updateAccount(data: IUpdateAccountParams) {
	const account = await db.update({ from: 'accounts', where: { id: data.id }, data })

	return account
}
