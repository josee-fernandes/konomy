import type { ITransaction } from '@/@types/transaction'
import { LSDB } from '@/utils/db'

interface IGetTransactionsParams {
	page: number
	limit?: number
}

export async function getTransactions({ page = 1, limit = 10 }: IGetTransactionsParams) {
	const db = new LSDB()

	const transactions = db.select({ from: 'transactions' })

	const pagination = {
		limit,
		offset: (page - 1) * limit,
	}

	const paginatedTransactions = db.select({ from: 'transactions', pagination })

	const data = {
		transactions: paginatedTransactions as ITransaction[],
		meta: {
			total: transactions.length,
			page: pagination.offset / pagination.limit + 1,
			perPage: pagination.limit,
			totalPages: Math.ceil(transactions.length / pagination.limit),
		},
	}

	return data
}
