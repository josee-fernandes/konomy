import { hash } from 'bcryptjs'

import { db } from '@/lib/lsdb'

interface ISignUpParams {
	name: string
	email: string
	password: string
	passwordConfirmation: string
}

export async function signUp(data: ISignUpParams) {
	const users = await db.select({ from: 'users' })

	if (users.some((user) => user.email === data.email)) {
		throw new Error('Email already in use')
	}

	const createdUser = await db.insert({
		into: 'users',
		data: {
			name: data.name,
			email: data.email,
			password: await hash(data.password, 10),
		},
	})

	const { password: _, ...userWithoutPassword } = createdUser

	return { ...userWithoutPassword, token: crypto.randomUUID() }
}
