import { LSDB } from '@/utils/db'

export const db = new LSDB({
	name: 'konomy',
	schema: {
		users: {
			name: 'string',
			email: 'string',
			password: 'string',
		},
		accounts: {
			name: 'string',
			balance: 'number',
			currency: 'string',
			userId: 'string',
		},
		transactions: {
			description: 'string',
			value: 'number',
			date: 'string',
			type: 'string',
			category: 'string',
			subcategory: 'string',
			origin: {
				type: 'string',
				name: 'string',
			},
			installments: {
				total: 'number',
				current: 'number',
				value: 'number',
			},
			accountId: 'string',
		},
	},
})
