import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { signUp } from '@/api/sign-up'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useAuthStore } from '@/stores/auth'

export const Route = createFileRoute('/_auth/sign-up')({
	component: SignUpPage,
	head: () => ({
		meta: [
			{ title: 'Konomy | Criar conta' },
			{ name: 'description', content: 'Crie uma conta Konomy para gerenciar suas finanças' },
		],
	}),
})

const signUpFormSchema = z
	.object({
		name: z.string().min(1, 'Nome é obrigatório'),
		email: z.email('E-mail inválido'),
		password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
		passwordConfirmation: z.string().min(8, 'A confirmação de senha deve ter pelo menos 8 caracteres'),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		path: ['passwordConfirmation'],
		message: 'As senhas não coincidem',
	})

type TSignUpFormSchema = z.infer<typeof signUpFormSchema>

function SignUpPage() {
	const navigate = useNavigate()
	const { setMemoryUser } = useAuthStore()

	const { handleSubmit, control, formState } = useForm<TSignUpFormSchema>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			passwordConfirmation: '',
		},
		mode: 'onChange',
	})

	const [showPassword, setShowPassword] = useState(false)
	const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

	async function onSubmit(data: TSignUpFormSchema) {
		const user = await signUp(data)

		setMemoryUser(user)
		navigate({ to: '/dashboard' })
	}

	function handleToggleShowPassword() {
		setShowPassword((oldShowPassword) => !oldShowPassword)
	}

	function handleToggleShowPasswordConfirmation() {
		setShowPasswordConfirmation((oldShowPasswordConfirmation) => !oldShowPasswordConfirmation)
	}

	return (
		<div className="max-w-[1200px] mx-auto p-10">
			<header className="text-center">
				<h1 className="text-2xl font-bold">Criar conta</h1>
				<p className="text-sm text-muted-foreground">Crie uma conta Konomy para gerenciar suas finanças</p>
			</header>
			<form className="my-10 flex flex-col gap-8 max-w-96 mx-auto" onSubmit={handleSubmit(onSubmit)}>
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
									placeholder="John Doe"
									autoComplete="off"
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name="email"
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									{...field}
									id="email"
									aria-invalid={fieldState.invalid}
									placeholder="john.doe@example.com"
									autoComplete="off"
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name="password"
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="password">Senha</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id="password"
										type={showPassword ? 'text' : 'password'}
										aria-invalid={fieldState.invalid}
										placeholder="••••••••"
										autoComplete="off"
									/>
									<InputGroupButton onClick={handleToggleShowPassword}>
										{showPassword ? <EyeOff name="eye-off" /> : <Eye name="eye" />}
									</InputGroupButton>
								</InputGroup>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name="passwordConfirmation"
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="passwordConfirmation">Confirmação de senha</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id="passwordConfirmation"
										type={showPasswordConfirmation ? 'text' : 'password'}
										aria-invalid={fieldState.invalid}
										placeholder="••••••••"
										autoComplete="off"
									/>
									<InputGroupButton onClick={handleToggleShowPasswordConfirmation}>
										{showPasswordConfirmation ? <EyeOff name="eye-off" /> : <Eye name="eye" />}
									</InputGroupButton>
								</InputGroup>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</FieldGroup>
				<Button type="submit" className="w-full" disabled={!formState.isValid}>
					Criar conta
				</Button>
			</form>
			<div className="text-center">
				<p className="inline-block">Já tem uma conta?</p>
				<Button type="button" variant="link" asChild className="text-base p-1">
					<Link to="/sign-in">Clique aqui para entrar</Link>
				</Button>
			</div>
			<div className="text-center">
				<Button type="button" variant="link" asChild className="text-sm p-1 mx-auto block">
					<Link to="/">Voltar para página inicial</Link>
				</Button>
			</div>
		</div>
	)
}
