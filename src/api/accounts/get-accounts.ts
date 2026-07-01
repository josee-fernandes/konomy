import { db } from '@/lib/lsdb'

interface IGetAccountsParams {
	userId: string
	page: number
	limit?: number
}

export async function getAccounts({ userId, page = 1, limit = 10 }: IGetAccountsParams) {
	const accounts = await db.select({ from: 'accounts', where: { userId } })

	const pagination = {
		limit,
		offset: (page - 1) * limit,
	}

	const paginatedAccounts = await db.select({
		from: 'accounts',
		where: { userId },
		orderBy: { field: 'createdAt', direction: 'desc' },
		pagination,
	})

	const data = {
		accounts: paginatedAccounts,
		meta: {
			total: accounts.length,
			page: pagination.offset / pagination.limit + 1,
			perPage: pagination.limit,
			totalPages: Math.ceil(accounts.length / pagination.limit),
		},
	}

	return data
}
