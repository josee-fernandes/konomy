import type { IAccount } from '@/@types/account'
import { LSDB } from '@/utils/db'

interface ICreateAccountParams extends Omit<IAccount, 'id' | 'createdAt' | 'updatedAt'> {}

export async function createAccount(data: ICreateAccountParams) {
	const db = new LSDB()

	console.log({ data })

	const account = db.insert({ into: 'accounts', data })

	return account as IAccount
}
