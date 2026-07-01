import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createAccount } from '@/api/accounts/create-account'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ECurrency } from '@/constants/currency'
import { useAuthStore } from '@/stores/auth'

const createAccountFormSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório'),
	currency: z.enum(ECurrency),
	balance: z.number(),
})

type TCreateAccountFormSchema = z.infer<typeof createAccountFormSchema>

export function AccountCreateForm() {
	const { user } = useAuthStore()

	const queryClient = useQueryClient()

	const { handleSubmit, control, formState, reset } = useForm<TCreateAccountFormSchema>({
		resolver: zodResolver(createAccountFormSchema),
		defaultValues: {
			name: '',
			currency: 'BRL',
			balance: 0,
		},
		mode: 'onChange',
	})

	const { mutateAsync: createAccountFn, isPending: isCreatingAccount } = useMutation({
		mutationFn: createAccount,
		onSuccess: () => {
			toast.success('Conta criada com sucesso')
			queryClient.invalidateQueries({ queryKey: ['accounts'] })
			queryClient.invalidateQueries({ queryKey: ['summary'] })
			reset()
			setOpen(false)
		},
		onError: (error) => {
			console.error(error)
			toast.error('Erro ao criar conta')
		},
	})

	const [open, setOpen] = useState(false)

	async function onSubmit(data: TCreateAccountFormSchema) {
		await createAccountFn({ ...data, userId: user!.id })
	}

	function onOpenChange(updatedOpen: boolean) {
		if (!updatedOpen) {
			reset()
		}

		setOpen(updatedOpen)
	}

	function handleClose() {
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Plus className="size-4" />
					Adicionar conta
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg!">
				<DialogHeader>
					<DialogTitle>Nova conta</DialogTitle>
					<DialogDescription>Crie uma nova conta para gerenciar suas finanças</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="max-h-[70vh] overflow-y-auto -mx-4 px-4 pb-2 flex flex-col gap-8">
						<FieldGroup>
							<Controller
								name="name"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="name">Nome</FieldLabel>
										<Input
											{...field}
											id="name"
											aria-invalid={fieldState.invalid}
											placeholder="Nome da conta"
											autoComplete="off"
											disabled={isCreatingAccount}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="balance"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="balance">Saldo inicial</FieldLabel>
										<Input
											{...field}
											id="balance"
											type="number"
											step="0.01"
											aria-invalid={fieldState.invalid}
											placeholder="0,00"
											autoComplete="off"
											disabled={isCreatingAccount}
											onChange={(event) => {
												const value = event.target.valueAsNumber
												field.onChange(Number.isNaN(value) ? 0 : value)
											}}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="currency"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="currency">Moeda</FieldLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger id="currency" className="w-full" aria-invalid={fieldState.invalid}>
												<SelectValue placeholder="Selecione a moeda" />
											</SelectTrigger>
											<SelectContent position="popper">
												<SelectGroup>
													{Object.values(ECurrency).map((currency) => (
														<SelectItem key={currency} value={currency}>
															{currency}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</FieldGroup>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" disabled={isCreatingAccount} onClick={handleClose}>
							Cancelar
						</Button>
						<Button type="submit" disabled={!formState.isValid || isCreatingAccount}>
							{isCreatingAccount ? <Loader2 className="size-4 animate-spin" /> : 'Confirmar'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
