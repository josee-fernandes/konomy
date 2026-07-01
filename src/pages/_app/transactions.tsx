import { useQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { BanknoteX, Loader2 } from 'lucide-react'
import { z } from 'zod'

import { getTransactions } from '@/api/transactions/get-transactions'
import { Pagination } from '@/components/pagination'
import { CreateTransactionForm } from '@/components/transactions/create-transaction-form'
import { TransactionCard } from '@/components/transactions/transaction-card'

const transactionSearchSchema = z.object({
	page: z
		.number()
		.optional()
		.transform((val) => {
			if (val) {
				return val < 1 ? 1 : val
			}
		}),
})

export const Route = createFileRoute('/_app/transactions')({
	component: TransactionsPage,
	validateSearch: transactionSearchSchema,
	head: () => ({
		meta: [
			{ title: 'Konomy | Transações' },
			{ name: 'description', content: 'Página de transações do Konomy para gerenciar suas finanças' },
		],
	}),
})

function TransactionsPage() {
	const { page = 1 } = Route.useSearch()
	const navigate = getRouteApi('/_app/transactions').useNavigate()

	const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
		queryKey: ['transactions', page],
		queryFn: () => getTransactions({ page }),
	})

	if (isLoadingTransactions) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader2 className="size-4 animate-spin" />
				<p>Carregando transações</p>
			</div>
		)
	}

	const { transactions, meta } = transactionsData!

	function handlePageChange(page: number) {
		navigate({ to: '/transactions', search: (prev) => ({ ...prev, page }) })
	}

	return (
		<div className="h-full flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Transações</h2>
				<div className="flex items-center gap-2">
					<CreateTransactionForm />
				</div>
			</div>
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
				{transactions?.map((transaction) => (
					<TransactionCard key={transaction.id} transaction={transaction} />
				))}
				{transactions.length === 0 && (
					<div className="col-span-full border rounded-lg h-auto flex flex-col items-center justify-center gap-2">
						<BanknoteX className="size-20 text-muted-foreground" />
						<p className="text-center text-lg text-muted-foreground font-medium">Nenhuma transação encontrada</p>
					</div>
				)}
			</div>
			<Pagination page={page} total={meta.total} perPage={meta.perPage} onPageChange={handlePageChange} />
		</div>
	)
}
