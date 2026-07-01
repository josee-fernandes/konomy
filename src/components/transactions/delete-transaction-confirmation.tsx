import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import type { ITransaction } from '@/@types/transaction'
import { deleteTransaction } from '@/api/transactions/delete-transaction'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface IDeleteTransactionConfirmationProps {
	transaction: ITransaction
}

export function DeleteTransactionConfirmation({ transaction }: IDeleteTransactionConfirmationProps) {
	const queryClient = useQueryClient()
	const { mutateAsync: deleteTransactionFn } = useMutation({
		mutationFn: (id: string) => deleteTransaction(id),
		onSuccess: () => {
			toast.success('Transação deletada com sucesso')
			queryClient.invalidateQueries({ queryKey: ['transactions'] })
			queryClient.invalidateQueries({ queryKey: ['summary'] })
			setOpen(false)
		},
	})

	const [open, setOpen] = useState(false)

	async function handleDeleteTransaction() {
		await deleteTransactionFn(transaction.id)
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
					<DialogTitle>Deletar transação</DialogTitle>
				</DialogHeader>
				<div>
					<p>Deletar uma transação é uma ação irreversível.</p>
					<p>Tem certeza que deseja deletar a transação "{transaction.description}"?</p>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => setOpen(false)}>
						Cancelar
					</Button>
					<Button type="submit" variant="destructive" onClick={handleDeleteTransaction}>
						Deletar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
