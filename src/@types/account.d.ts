import { ECurrency } from '@/constants/currency'

export type TAccountCurrency = keyof typeof ECurrency

export interface IAccount {
	id: string
	name: string
	balance: number
	currency: TAccountCurrency
	createdAt: string
	updatedAt: string
	userId: string
}
