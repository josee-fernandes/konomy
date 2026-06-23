import { hash } from 'bcryptjs'

import type { IUser } from '@/@types/auth'

interface ISignUpParams {
	name: string
	email: string
	password: string
	passwordConfirmation: string
}

export async function signUp(data: ISignUpParams) {
	const users = JSON.parse(localStorage.getItem('@konomy:users') ?? '[]')

	if (users.some((user: IUser) => user.email === data.email)) {
		throw new Error('Email already in use')
	}

	const newUser = {
		id: crypto.randomUUID(),
		name: data.name,
		email: data.email,
		password: await hash(data.password, 10),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}

	const updatedUsers = [...users, newUser]

	localStorage.setItem('@konomy:users', JSON.stringify(updatedUsers))

	return { ...newUser, token: crypto.randomUUID() }
}
