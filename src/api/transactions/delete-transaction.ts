import { db } from '@/lib/lsdb'

export async function deleteTransaction(id: string) {
	const transaction = (await db.select({ from: 'transactions', where: { id } }))[0]

	const account = (await db.select({ from: 'accounts', where: { id: transaction.accountId } }))[0]

	const updatedBalance =
		transaction.type === 'income' ? account.balance - transaction.value : account.balance + transaction.value

	await db.update({
		from: 'accounts',
		where: { id: account.id },
		data: { balance: updatedBalance },
	})

	await db.delete({ from: 'transactions', id })
}
