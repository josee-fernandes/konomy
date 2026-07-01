import type { TAccountCurrency } from '@/@types/account'

export function formatCurrency(value: number, currency: TAccountCurrency = 'BRL') {
	return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
}

export function calculatePerDayExpense(totalExpense: number) {
	const today = new Date()
	const monthDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
	const daysGone = today.getDate()

	const perDaySoFar = totalExpense / daysGone
	const projectedTotal = perDaySoFar * monthDays

	return {
		perDaySoFar,
		projectedTotal,
	}
}
