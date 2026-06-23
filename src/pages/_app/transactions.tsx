import { useQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react'
import { z } from 'zod'

import { getTransactions } from '@/api/get-transactions'
import { CreateTransactionForm } from '@/components/create-transaction-form'
import { TransactionCard } from '@/components/transaction-card'
import { Button } from '@/components/ui/button'

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
		<div>
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Transações</h2>
				<div className="flex items-center gap-2">
					<CreateTransactionForm />
				</div>
			</div>
			<div className="mt-4 flex flex-col gap-4">
				{transactions?.map((transaction) => (
					<TransactionCard key={transaction.id} transaction={transaction} />
				))}
			</div>
			<div className="mt-4 flex items-center justify-between">
				<p>
					Página {meta.page} de {meta.totalPages}
				</p>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
						<ChevronsLeft className="size-4" />
					</Button>
					<Button variant="outline" size="icon" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
						<ChevronLeft className="size-4" />
					</Button>

					<Button
						variant="outline"
						size="icon"
						disabled={page === meta.totalPages}
						onClick={() => handlePageChange(page + 1)}
					>
						<ChevronRight className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						disabled={page === meta.totalPages}
						onClick={() => handlePageChange(meta.totalPages)}
					>
						<ChevronsRight className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
