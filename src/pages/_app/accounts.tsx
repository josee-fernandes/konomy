import { useQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { Loader2, Wallet } from 'lucide-react'
import { z } from 'zod'

import type { IAccount } from '@/@types/account'
import { getAccounts } from '@/api/accounts/get-accounts'
import { AccountCard } from '@/components/accounts/account-card'
import { AccountCreateForm } from '@/components/accounts/create-account-form'
import { Pagination } from '@/components/pagination'

const accountsSearchSchema = z.object({
	page: z
		.number()
		.optional()
		.transform((val) => {
			if (val) {
				return val < 1 ? 1 : val
			}
		}),
})

export const Route = createFileRoute('/_app/accounts')({
	component: AccountsPage,
	validateSearch: accountsSearchSchema,
	head: () => ({
		meta: [
			{ title: 'Konomy | Contas' },
			{ name: 'description', content: 'Página de contas do Konomy para gerenciar suas contas' },
		],
	}),
})

function AccountsPage() {
	const { page = 1 } = Route.useSearch()
	const navigate = getRouteApi('/_app/accounts').useNavigate()

	const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
		queryKey: ['accounts', page],
		queryFn: () => getAccounts({ page }),
	})

	if (isLoadingAccounts) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader2 className="size-4 animate-spin" />
				<p>Carregando contas</p>
			</div>
		)
	}

	const { accounts, meta } = accountsData!

	function handlePageChange(page: number) {
		navigate({ to: '/accounts', search: (prev) => ({ ...prev, page }) })
	}

	return (
		<div className="h-full flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Contas</h2>
				<div className="flex items-center gap-2">
					<AccountCreateForm />
				</div>
			</div>
			<div className="flex-1">
				{accounts.length > 0 && (
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						{accounts?.map((account) => (
							// TODO: add lsdb support for enums
							<AccountCard key={account.id} account={account as IAccount} />
						))}
					</div>
				)}
				{accounts.length === 0 && (
					<div className="h-full border rounded-lg flex flex-col items-center justify-center gap-2 bg-linear-210 from-background via-card via-35% to-background to-90%">
						<Wallet className="size-20 text-muted-foreground" />
						<p className="text-center text-lg text-muted-foreground font-medium">Nenhuma conta encontrada</p>
					</div>
				)}
			</div>
			<Pagination page={page} total={meta.total} perPage={meta.perPage} onPageChange={handlePageChange} />
		</div>
	)
}
