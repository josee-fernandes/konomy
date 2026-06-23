import { createFileRoute, Link } from '@tanstack/react-router'
import { BanknoteArrowDown, BanknoteArrowUp, CreditCard, DollarSign, QrCode } from 'lucide-react'

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

function DashboardPage() {
	const data = [
		{
			id: crypto.randomUUID(),
			category: 'your-balance',
			title: 'Em conta',
			icon: <DollarSign className="size-4" />,
			value: 460.57,
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
			value: 3201.44,
		},
	]

	const transtactions = [
		{
			id: crypto.randomUUID(),
			description: 'Compra de roupas',
			value: 100.0,
			date: new Date('2026-06-23').toISOString(),
			type: 'expense',
			category: 'clothing',
			subcategory: 'clothes',
			paymentMethod: 'credit card',
			installments: {
				id: crypto.randomUUID(),
				total: 1,
				current: 1,
				value: 100.0,
			},
			origin: {
				id: crypto.randomUUID(),
				type: 'credit-card',
				name: 'Itaú',
				logo: <CreditCard className="size-4 text-primary" />,
			},
		},
		{
			id: crypto.randomUUID(),
			description: 'Dívida Layane',
			value: 500.0,
			date: new Date('2026-06-20').toISOString(),
			type: 'expense',
			category: 'other',
			subcategory: 'other',
			paymentMethod: 'pix',
			origin: {
				id: crypto.randomUUID(),
				type: 'pix',
				name: 'Pix',
				logo: <QrCode className="size-4 text-primary" />,
			},
		},
	]

	const { perDaySoFar, projectedTotal } = calculatePerDayExpense(
		data.find((item) => item.category === 'current-expenses')?.value,
	)

	return (
		<div className="">
			<section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{data.map((item) => (
					<InfoCard key={item.title} title={item.title} icon={item.icon} highlight={formatCurrency(item.value)} />
				))}
			</section>
			<section className="mt-8">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Últimos lançamentos</h2>
					<div>
						<Button asChild variant="link">
							<Link to="/transactions">Ver todos</Link>
						</Button>
					</div>
				</div>
				<div className="mt-4 flex flex-col gap-4">
					{transtactions.map((transaction) => (
						<div key={transaction.id} className="bg-card p-4 rounded-lg border">
							<p>{transaction.description}</p>
							<p>{formatCurrency(transaction.value)}</p>
							<p>{Intl.DateTimeFormat('pt-BR').format(new Date(transaction.date))}</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2">
									{transaction.origin.logo}
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
