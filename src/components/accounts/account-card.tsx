import type { IAccount } from '@/@types/account'
import { formatCurrency } from '@/utils/currency'

import { DeleteAccountConfirmation } from './delete-account-confirmation'
import { UpdateAccountForm } from './update-account-form'

interface IAccountCardProps {
	account: IAccount
}

export function AccountCard({ account }: IAccountCardProps) {
	return (
		<div key={account.id} className="group bg-card p-4 rounded-lg border">
			<div className="flex items-center justify-between">
				<p className="text-lg font-medium">{account.name}</p>
				<div className="flex items-center gap-2">
					<UpdateAccountForm account={account} />
					<DeleteAccountConfirmation account={account} />
				</div>
			</div>
			<p className="text-2xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
		</div>
	)
}
