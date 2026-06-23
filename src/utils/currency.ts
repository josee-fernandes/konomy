export function formatCurrency(value: number) {
	return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
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
