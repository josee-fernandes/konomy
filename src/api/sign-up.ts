import { hash } from 'bcryptjs'

import type { IUser } from '@/@types/auth'
import { LSDB } from '@/utils/db'

interface ISignUpParams {
	name: string
	email: string
	password: string
	passwordConfirmation: string
}

export async function signUp(data: ISignUpParams) {
	const db = new LSDB()

	const users = db.select({ from: 'users' })

	if (users.some((user: IUser) => user.email === data.email)) {
		throw new Error('Email already in use')
	}

	const createdUser = db.insert({
		into: 'users',
		data: {
			name: data.name,
			email: data.email,
			password: await hash(data.password, 10),
		},
	})

	delete createdUser.password

	return { ...createdUser, token: crypto.randomUUID() } as IUser
}
