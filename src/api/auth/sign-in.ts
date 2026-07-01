import { compare } from 'bcryptjs'

import type { IUser } from '@/@types/auth'
import { LSDB } from '@/utils/db'

interface ISignInParams {
	email: string
	password: string
}

export async function signIn(data: ISignInParams) {
	const db = new LSDB()

	const user = db.select({ from: 'users', where: { email: data.email } })[0]

	if (!user) {
		throw new Error('Invalid credentials')
	}

	const validPassword = await compare(data.password, user.password)

	if (!validPassword) {
		throw new Error('Invalid credentials')
	}

	return { ...user, token: crypto.randomUUID() } as IUser
}
