import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createTransaction } from '@/api/transactions/create-transaction'
import { DatePicker } from '@/components/date-picker'
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
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const createTransactionFormSchema = z.object({
	description: z.string().min(1, 'Descrição é obrigatória'),
	value: z.number().min(1, 'Valor é obrigatório'),
	date: z.string(),
	type: z.enum(['income', 'expense']),
	category: z.string().min(1, 'Categoria é obrigatória'),
	subcategory: z.string().min(1, 'Subcategoria é obrigatória'),
	origin: z.object({
		id: z.string().min(1, 'ID da origem é obrigatório'),
		type: z.enum(['credit-card', 'pix', 'bank-slip']),
		name: z.string().min(1, 'Nome da origem é obrigatório'),
	}),
})

type TCreateTransactionFormSchema = z.infer<typeof createTransactionFormSchema>

export function CreateTransactionForm() {
	const queryClient = useQueryClient()

	const { handleSubmit, control, formState, reset } = useForm<TCreateTransactionFormSchema>({
		resolver: zodResolver(createTransactionFormSchema),
		defaultValues: {
			description: '',
			value: 0,
			date: new Date().toISOString(),
			type: 'income',
			category: '',
			subcategory: '',
			origin: {
				id: crypto.randomUUID(),
				type: 'credit-card',
				name: '',
			},
		},
		mode: 'onChange',
	})

	const { mutateAsync: createTransactionFn, isPending: isCreatingTransaction } = useMutation({
		mutationFn: createTransaction,
		onSuccess: () => {
			toast.success('Lançamento criado com sucesso')
			queryClient.invalidateQueries({ queryKey: ['transactions'] })
			queryClient.invalidateQueries({ queryKey: ['summary'] })
			reset()
			setOpen(false)
		},
		onError: (error) => {
			console.error(error)
			toast.error('Erro ao criar lançamento')
		},
	})

	const [open, setOpen] = useState(false)

	async function onSubmit(data: TCreateTransactionFormSchema) {
		await createTransactionFn(data)
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
					Adicionar transação
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg!">
				<DialogHeader>
					<DialogTitle>Novo lançamento</DialogTitle>
					<DialogDescription>Crie um novo lançamento para sua conta</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="max-h-[70vh] overflow-y-auto -mx-4 px-4 pb-2 flex flex-col gap-8">
						<FieldGroup>
							<Controller
								name="description"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="description">Descrição</FieldLabel>
										<Input
											{...field}
											id="description"
											aria-invalid={fieldState.invalid}
											placeholder="Compra de roupas"
											autoComplete="off"
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="value"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="value">Valor</FieldLabel>
										<Input
											{...field}
											id="value"
											type="number"
											step="0.01"
											min="0.01"
											aria-invalid={fieldState.invalid}
											placeholder="0,00"
											autoComplete="off"
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
								name="date"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="date">Data</FieldLabel>
										<DatePicker
											id="date"
											value={field.value}
											aria-invalid={fieldState.invalid}
											disabled={isCreatingTransaction}
											onChange={field.onChange}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="type"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="type">Tipo</FieldLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger id="type" className="w-full" aria-invalid={fieldState.invalid}>
												<SelectValue placeholder="Selecione o tipo" />
											</SelectTrigger>
											<SelectContent position="popper">
												<SelectGroup>
													<SelectItem value="income">Receita</SelectItem>
													<SelectItem value="expense">Despesa</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="category"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="category">Categoria</FieldLabel>
										<Input
											{...field}
											id="category"
											aria-invalid={fieldState.invalid}
											placeholder="clothing"
											autoComplete="off"
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="subcategory"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="subcategory">Subcategoria</FieldLabel>
										<Input
											{...field}
											id="subcategory"
											aria-invalid={fieldState.invalid}
											placeholder="clothes"
											autoComplete="off"
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<FieldSeparator />
							<Controller
								name="origin.name"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="origin-name">Origem</FieldLabel>
										<Input
											{...field}
											id="origin-name"
											aria-invalid={fieldState.invalid}
											placeholder="Itaú, Nubank etc."
											autoComplete="off"
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="origin.type"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="origin-type">Tipo de pagamento</FieldLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger id="origin-type" className="w-full" aria-invalid={fieldState.invalid}>
												<SelectValue placeholder="Selecione o tipo de origem" />
											</SelectTrigger>
											<SelectContent position="popper">
												<SelectGroup>
													<SelectItem value="credit-card">Cartão de crédito</SelectItem>
													<SelectItem value="pix">PIX</SelectItem>
													<SelectItem value="bank-slip">Boleto</SelectItem>
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
						<Button type="button" variant="outline" disabled={isCreatingTransaction} onClick={handleClose}>
							Cancelar
						</Button>
						<Button type="submit" disabled={!formState.isValid || isCreatingTransaction}>
							Confirmar
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
