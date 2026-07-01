import { useQuery } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react'

import type { TAccountCurrency } from '@/@types/account'
import type { ITransaction } from '@/@types/transaction'
import { getAccount } from '@/api/accounts/get-account'
import { DeleteTransactionConfirmation } from '@/components/transactions/delete-transaction-confirmation'
import { UpdateTransactionForm } from '@/components/transactions/update-transaction-form'
import { Separator } from '@/components/ui/separator'
import { ETransactionOriginType } from '@/constants/transaction'
import { formatCurrency } from '@/utils/currency'

interface ITransactionCardProps {
	transaction: ITransaction
}

export function TransactionCard({ transaction }: ITransactionCardProps) {
	const { data: account, isLoading: isLoadingAccount } = useQuery({
		queryKey: ['accounts', transaction.accountId],
		queryFn: () => getAccount({ id: transaction.accountId }),
	})

	return (
		<div className="group p-4 rounded-lg border relative shiny-bg">
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
			{isLoadingAccount ? (
				<div className="flex items-center justify-center">
					<Loader2 className="size-4 animate-spin" />
				</div>
			) : (
				<>
					<p className="text-2xl font-bold">
						{formatCurrency(transaction.value, account?.currency as TAccountCurrency)}
					</p>
				</>
			)}
			<div className="mt-4 flex flex-col items-start sm:flex-row sm:items-center gap-2">
				<p className="text-sm text-muted-foreground">
					Conta: <span className="font-bold">{account?.name}</span>
				</p>
				<Separator orientation="vertical" className="hidden sm:block" />
				<div className="flex items-center gap-2 text-muted-foreground">
					<div className="">{ETransactionOriginType[transaction.origin.type].icon}</div>
					<p className="text-sm">{ETransactionOriginType[transaction.origin.type].name}</p>
				</div>
				<Separator orientation="vertical" className="hidden sm:block" />
				{transaction.installments && (
					<div className="flex items-center gap-2">
						<p className="text-sm text-muted-foreground">
							Parcela {transaction.installments.current} de {transaction.installments.total}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
