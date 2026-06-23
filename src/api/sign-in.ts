import { compare } from 'bcryptjs'

import type { IUser } from '@/@types/auth'

interface ISignInParams {
	email: string
	password: string
}

export async function signIn(data: ISignInParams) {
	const users = JSON.parse(localStorage.getItem('@konomy:users') ?? '[]')

	const user = users.find((user: IUser) => user.email === data.email)

	if (!user) {
		throw new Error('Invalid credentials')
	}

	const validPassword = await compare(data.password, user.password)

	if (!validPassword) {
		throw new Error('Invalid credentials')
	}

	return { ...user, token: crypto.randomUUID() }
}
