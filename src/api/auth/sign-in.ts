import { compare } from 'bcryptjs'

import type { IUser } from '@/@types/auth'
import { db } from '@/lib/lsdb'

interface ISignInParams {
	email: string
	password: string
}

export async function signIn(data: ISignInParams) {
	const user = (await db.select({ from: 'users', where: { email: data.email } }))[0]

	if (!user) {
		throw new Error('Invalid credentials')
	}

	const validPassword = await compare(data.password, user.password)

	if (!validPassword) {
		throw new Error('Invalid credentials')
	}

	const { password: _, ...userWithoutPassword } = user

	return { ...userWithoutPassword, token: crypto.randomUUID() } as IUser
}
