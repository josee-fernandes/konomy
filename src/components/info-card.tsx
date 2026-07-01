import { BanknoteArrowDown, BanknoteArrowUp, DollarSign } from 'lucide-react'

import type { ISummaryItem } from '@/api/get-summary'
import { formatCurrency } from '@/utils/currency'

interface IInfoCardProps {
	item: ISummaryItem
}

const SUMMARY_ITEM_ICON = {
	balance: <DollarSign className="size-4" />,
	'expected-income': <BanknoteArrowUp className="size-4" />,
	expenses: <BanknoteArrowDown className="size-4" />,
} as const

export function InfoCard({ item }: IInfoCardProps) {
	return (
		<div className="bg-linear-210 from-background via-card via-35% to-background to-90% p-4 rounded-lg sm:max-w-96 flex flex-col gap-2 border">
			<div className="flex items-center justify-between">
				<h3>{item.title}</h3>
				<div>{SUMMARY_ITEM_ICON[item.category]}</div>
			</div>
			<div>
				<p className="text-2xl font-bold">{formatCurrency(item.value)}</p>
			</div>
		</div>
	)
}
