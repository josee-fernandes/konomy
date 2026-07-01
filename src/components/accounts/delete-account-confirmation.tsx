import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import type { IAccount } from '@/@types/account'
import { deleteAccount } from '@/api/accounts/delete-account'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface IDeleteAccountConfirmationProps {
	account: IAccount
}

export function DeleteAccountConfirmation({ account }: IDeleteAccountConfirmationProps) {
	const queryClient = useQueryClient()
	const { mutateAsync: deleteAccountFn } = useMutation({
		mutationFn: (id: string) => deleteAccount(id),
		onSuccess: () => {
			toast.success('Conta deletada com sucesso')
			queryClient.invalidateQueries({ queryKey: ['accounts'] })
			queryClient.invalidateQueries({ queryKey: ['summary'] })
			setOpen(false)
		},
	})

	const [open, setOpen] = useState(false)

	async function handleDeleteAccount() {
		await deleteAccountFn(account.id)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon-sm" className="group-hover:opacity-100 opacity-0">
					<Trash className="size-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg!">
				<DialogHeader>
					<DialogTitle>Deletar conta</DialogTitle>
				</DialogHeader>
				<div>
					<p>Deletar uma conta é uma ação irreversível. Tem certeza que deseja deletar a conta "{account.name}"?</p>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => setOpen(false)}>
						Cancelar
					</Button>
					<Button type="submit" variant="destructive" onClick={handleDeleteAccount}>
						Deletar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
