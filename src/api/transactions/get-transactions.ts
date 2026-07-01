import { db } from '@/lib/lsdb'

interface IGetTransactionsParams {
	page: number
	limit?: number
}

export async function getTransactions({ page = 1, limit = 10 }: IGetTransactionsParams) {
	const transactions = await db.select({ from: 'transactions' })

	const pagination = {
		limit,
		offset: (page - 1) * limit,
	}

	const paginatedTransactions = await db.select({
		from: 'transactions',
		orderBy: { field: 'date', direction: 'desc' },
		pagination,
	})

	const data = {
		transactions: paginatedTransactions,
		meta: {
			total: transactions.length,
			page: pagination.offset / pagination.limit + 1,
			perPage: pagination.limit,
			totalPages: Math.ceil(transactions.length / pagination.limit),
		},
	}

	return data
}
