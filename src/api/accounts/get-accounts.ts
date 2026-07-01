import type { IAccount } from '@/@types/account'
import { LSDB } from '@/utils/db'

interface IGetAccountsParams {
	page: number
	limit?: number
}

export async function getAccounts({ page = 1, limit = 10 }: IGetAccountsParams) {
	const db = new LSDB()

	const accounts = db.select({ from: 'accounts' })

	const pagination = {
		limit,
		offset: (page - 1) * limit,
	}

	const paginatedAccounts = db.select({
		from: 'accounts',
		orderBy: { field: 'createdAt', direction: 'desc' },
		pagination,
	})

	const data = {
		accounts: paginatedAccounts as IAccount[],
		meta: {
			total: accounts.length,
			page: pagination.offset / pagination.limit + 1,
			perPage: pagination.limit,
			totalPages: Math.ceil(accounts.length / pagination.limit),
		},
	}

	return data
}
