import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BanknoteArrowDown, BanknoteArrowUp, DollarSign, Loader2 } from 'lucide-react'

import { getTransactions } from '@/api/get-transactions'
import { CreateTransactionForm } from '@/components/create-transaction-form'
import { InfoCard } from '@/components/info-card'
import { TransactionCard } from '@/components/transaction-card'
import { Button } from '@/components/ui/button'
import { calculatePerDayExpense, formatCurrency } from '@/utils/currency'

export const Route = createFileRoute('/_app/dashboard')({
	component: DashboardPage,
	head: () => ({
		meta: [
			{ title: 'Konomy | Dashboard' },
			{ name: 'description', content: 'Dashboard of Konomy to manage your finances' },
		],
	}),
})

function DashboardPage() {
	const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
		queryKey: ['transactions', 1],
		queryFn: () => getTransactions({ page: 1, limit: 3 }),
	})

	if (isLoadingTransactions) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader2 className="size-4 animate-spin" />
				<p>Carregando transações</p>
			</div>
		)
	}

	const { transactions } = transactionsData

	const summary = [
		{
			id: crypto.randomUUID(),
			category: 'your-balance',
			title: 'Em conta',
			icon: <DollarSign className="size-4" />,
			value:
				transactions?.reduce((acc, transaction) => {
					if (transaction.type === 'income') {
						return acc + transaction.value
					}
					return acc
				}, 0) || 0,
		},
		{
			id: crypto.randomUUID(),
			category: 'expected-income',
			title: 'Entrada esperada',
			icon: <BanknoteArrowUp className="size-4" />,
			value: 5000.0,
		},
		{
			id: crypto.randomUUID(),
			category: 'current-expenses',
			title: 'Gastos atuais',
			icon: <BanknoteArrowDown className="size-4" />,
			value:
				transactions?.reduce((acc, transaction) => {
					if (transaction.type === 'expense') {
						return acc + transaction.value
					}
					return acc
				}, 0) || 0,
		},
	]

	const { perDaySoFar, projectedTotal } = calculatePerDayExpense(
		summary.find((item) => item.category === 'current-expenses')?.value,
	)

	return (
		<div>
			<section className="">
				<h2 className="text-2xl font-bold">Resumo</h2>
				<div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
					{summary.map((item) => (
						<InfoCard key={item.title} title={item.title} icon={item.icon} highlight={formatCurrency(item.value)} />
					))}
				</div>
			</section>
			<section className="mt-8">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Últimos lançamentos</h2>
					<div className="flex items-center gap-2">
						<Button asChild variant="link">
							<Link to="/transactions">Ver todos</Link>
						</Button>
						<CreateTransactionForm />
					</div>
				</div>
				<div className="mt-4 flex flex-col gap-4">
					{transactions.length === 0 && (
						<div className="bg-card p-4 rounded-lg border">
							<p>Você ainda não tem nenhum lançamento</p>
						</div>
					)}
					{transactions.map((transaction) => (
						<TransactionCard key={transaction.id} transaction={transaction} />
					))}
				</div>
			</section>
			<section className="mt-8">
				<h2 className="text-2xl font-bold">Insights</h2>
				<p className="mt-4">
					Hoje é dia {Intl.DateTimeFormat('pt-BR', { day: 'numeric' }).format(new Date())} e você gastou aproximadamente{' '}
					{formatCurrency(perDaySoFar)} por dia esse mês (
					{Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())}
					), projetando {formatCurrency(projectedTotal)} total para o mês se você continuar gastando da mesma forma.
				</p>
				<div className="mt-4"></div>
			</section>
		</div>
	)
}
