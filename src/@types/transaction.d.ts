export interface ITransaction {
	id: string
	description: string
	value: number
	date: string
	type: 'income' | 'expense'
	category: string
	subcategory: string
	origin: {
		type: 'credit-card' | 'pix' | 'bank-slip'
		name: string
	}
	installments: {
		total: number
		current: number
		value: number
	}
	accountId: string
}
