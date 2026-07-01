import type { IAccount } from '@/@types/account'
import { LSDB } from '@/utils/db'

interface IUpdateAccountParams extends Omit<IAccount, 'createdAt' | 'updatedAt'> {}

export async function updateAccount(data: IUpdateAccountParams) {
	const db = new LSDB()

	const account = db.update({ from: 'accounts', where: { id: data.id }, data })

	return account as IAccount
}
