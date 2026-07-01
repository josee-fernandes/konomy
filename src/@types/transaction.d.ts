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
		type: 'credit-card' | 'pix' | 'bank-slip'
		name: string
	}
	installments?: {
		id: string
		total: number
		current: number
		value: number
	}
	// TODO: adicionar account id
}
