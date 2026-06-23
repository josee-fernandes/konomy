import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useAuthStore } from '@/stores/auth'

export const Route = createFileRoute('/_auth/sign-in')({
	component: SignInPage,
	head: () => ({
		meta: [
			{ title: 'Konomy | Sign in' },
			{ name: 'description', content: 'Sign in to Konomy to manage your finances' },
		],
	}),
})

const signInFormSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

type TSignInFormSchema = z.infer<typeof signInFormSchema>

function SignInPage() {
	const navigate = useNavigate()
	const { setMemoryUser } = useAuthStore()

	const { handleSubmit, control, formState, setValue } = useForm<TSignInFormSchema>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onChange',
	})

	const [showPassword, setShowPassword] = useState(false)

	async function onSubmit(data: TSignInFormSchema) {
		try {
			const user = await signIn(data)

			setMemoryUser(user)
			navigate({ to: '/dashboard' })
		} catch (error) {
			setValue('password', '')
			toast.error('Invalid credentials')
		}
	}

	function handleToggleShowPassword() {
		setShowPassword((oldShowPassword) => !oldShowPassword)
	}

	return (
		<div className="max-w-[1200px] mx-auto p-10">
			<header className="text-center">
				<h1 className="text-2xl font-bold">Sign In</h1>
				<p className="text-sm text-muted-foreground">Sign in to Konomy</p>
			</header>
			<form className="my-10 flex flex-col gap-8 max-w-96 mx-auto" onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
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
									autoComplete="email"
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
										aria-invalid={fieldState.invalid}
										placeholder="********"
										autoComplete="current-password"
										type={showPassword ? 'text' : 'password'}
									/>
									<InputGroupButton onClick={handleToggleShowPassword}>
										{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
									</InputGroupButton>
								</InputGroup>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</FieldGroup>
				<Button type="submit" className="w-full" disabled={!formState.isValid}>
					Sign In
				</Button>
			</form>
			<div className="text-center">
				<p className="inline-block">Don't have an account?</p>
				<Button type="button" variant="link" asChild className="text-base p-1">
					<Link to="/sign-up">Click here to sign up</Link>
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
