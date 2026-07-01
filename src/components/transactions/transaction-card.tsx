import { ArrowDown, ArrowUp } from 'lucide-react'

import type { ITransaction } from '@/@types/transaction'
import { ETransactionOriginType } from '@/constants/transaction'
import { formatCurrency } from '@/utils/currency'

import { DeleteTransactionConfirmation } from './delete-transaction-confirmation'
import { UpdateTransactionForm } from './update-transaction-form'

interface ITransactionCardProps {
	transaction: ITransaction
}

export function TransactionCard({ transaction }: ITransactionCardProps) {
	return (
		<div key={transaction.id} className="group bg-card p-4 rounded-lg border">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{transaction.type === 'expense' ? (
						<ArrowDown className="size-4 text-rose-500" />
					) : (
						<ArrowUp className="size-4 text-emerald-500" />
					)}
					<p className="text-lg font-bold">
						{transaction.description}
						<span className="ml-2 text-sm text-muted-foreground">
							{Intl.DateTimeFormat('pt-BR').format(new Date(transaction.date))}
						</span>
					</p>
				</div>
				<div className="flex items-center gap-2">
					<UpdateTransactionForm transaction={transaction} />
					<DeleteTransactionConfirmation transaction={transaction} />
				</div>
			</div>
			<p>{formatCurrency(transaction.value)}</p>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2">
					{ETransactionOriginType[transaction.origin.type].icon}
					{ETransactionOriginType[transaction.origin.type].name} - <p>{transaction.origin.name}</p>
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
	)
}
