import { createFileRoute, Link } from '@tanstack/react-router'
import { BanknoteArrowDown, BanknoteArrowUp, CreditCard, DollarSign, QrCode } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { ITransaction } from '@/@types/transaction'
import { getTransactions } from '@/api/get-transactions'
import { CreateTransactionForm } from '@/components/create-transaction-form'
import { InfoCard } from '@/components/info-card'
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

const ETransactionOriginTypeIcon = {
	'credit-card': <CreditCard className="size-4" />,
	pix: <QrCode className="size-4" />,
}

function DashboardPage() {
	const [transactions, setTransactions] = useState<ITransaction[]>([])

	const data = [
		{
			id: crypto.randomUUID(),
			category: 'your-balance',
			title: 'Em conta',
			icon: <DollarSign className="size-4" />,
			value: transactions.reduce((acc, transaction) => {
				if (transaction.type === 'income') {
					return acc + transaction.value
				}
				return acc
			}, 0),
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
			value: transactions.reduce((acc, transaction) => {
				if (transaction.type === 'expense') {
					return acc + transaction.value
				}
				return acc
			}, 0),
		},
	]

	const { perDaySoFar, projectedTotal } = calculatePerDayExpense(
		data.find((item) => item.category === 'current-expenses')?.value,
	)

	async function loadTransactions() {
		const _transactions = await getTransactions()
		setTransactions(_transactions)
	}

	useEffect(() => {
		loadTransactions()
	}, [])

	return (
		<div className="">
			<section className="">
				<h2 className="text-2xl font-bold">Resumo</h2>
				<div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
					{data.map((item) => (
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
						<div key={transaction.id} className="bg-card p-4 rounded-lg border">
							<p>{transaction.description}</p>
							<p>{formatCurrency(transaction.value)}</p>
							<p>{Intl.DateTimeFormat('pt-BR').format(new Date(transaction.date))}</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2">
									{ETransactionOriginTypeIcon[transaction.origin.type]}
									<p>{transaction.origin.name}</p>
								</div>
							</div>
							{transaction.installments && (
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-2">
										<p>Parcela</p>
										<p>{transaction.installments.current}</p>
										<p>/</p>
										<p>{transaction.installments.total}</p>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</section>
			<section className="mt-8">
				<h2 className="text-2xl font-bold">Insights</h2>
				<p className="mt-4">
					Hoje é {Intl.DateTimeFormat('pt-BR').format(new Date())}. Você gastou aproximadamente{' '}
					{formatCurrency(perDaySoFar)} por dia, projetando {formatCurrency(projectedTotal)} total para o mês se você
					continuar gastando da mesma forma.
				</p>
				<div className="mt-4"></div>
			</section>
		</div>
	)
}
