import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
			{ title: 'Konomy | Sign up' },
			{ name: 'description', content: 'Sign up to Konomy to manage your finances' },
		],
	}),
})

const signUpFormSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		email: z.email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters long'),
		passwordConfirmation: z.string().min(8, 'Password confirmation must be at least 8 characters long'),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		path: ['passwordConfirmation'],
		message: 'Passwords do not match',
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

		toast.success('User created successfully')
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
				<h1 className="text-2xl font-bold">Sign Up</h1>
				<p className="text-sm text-muted-foreground">Sign up to Konomy</p>
			</header>
			<form className="my-10 flex flex-col gap-8 max-w-96 mx-auto" onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<Controller
						name="name"
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="name">Name</FieldLabel>
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
								<FieldLabel htmlFor="password">Password</FieldLabel>
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
								<FieldLabel htmlFor="passwordConfirmation">Password Confirmation</FieldLabel>
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
					Sign Up
				</Button>
			</form>
			<div className="text-center">
				<p className="inline-block">Already have an account?</p>
				<Button type="button" variant="link" asChild className="text-base p-1">
					<Link to="/sign-in">Click here to sign in</Link>
				</Button>
			</div>
			<div className="text-center">
				<Button type="button" variant="link" asChild className="text-sm p-1 mx-auto block">
					<Link to="/">Back to home</Link>
				</Button>
			</div>
		</div>
	)
}
