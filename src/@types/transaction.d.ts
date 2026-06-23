export interface ITransaction {
	id: string
	description: string
	value: number
	date: string
	type: 'income' | 'expense'
	category: string
	subcategory: string
	origin: {
		id: string
		type: string
		name: string
	}
	installments?: {
		id: string
		total: number
		current: number
		value: number
	}
}
