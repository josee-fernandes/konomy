import type { IAccount } from '@/@types/account'
import { db } from '@/lib/lsdb'

interface ICreateAccountParams extends Omit<IAccount, 'id' | 'createdAt' | 'updatedAt'> {}

export async function createAccount(data: ICreateAccountParams) {
	const account = await db.insert({ into: 'accounts', data })

	return account
}
