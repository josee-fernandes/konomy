import { db } from '@/lib/lsdb'

interface IGetAccountParams {
	id: string
}

export async function getAccount({ id }: IGetAccountParams) {
	const account = (await db.select({ from: 'accounts', where: { id } }))[0]

	if (!account) {
		throw new Error('Account not found')
	}

	return account
}
