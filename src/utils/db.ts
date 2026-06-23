type TTables = 'users' | 'transactions'

interface ISelectParams {
	from: TTables
	where?: Record<string, any>
	id?: string
	pagination?: {
		limit?: number
		offset: number
	}
	orderBy?: {
		field: string
		direction: 'asc' | 'desc'
	}
}

interface IInsertParams {
	into: TTables
	data: Record<string, any>
}

interface IUpdateParams {
	from: TTables
	where: Record<string, any>
	data: Record<string, any>
}

interface IDeleteParams {
	from: TTables
	id: string
}

export class LSDB {
	private readonly prefix = '@konomy:'

	constructor() {}

	private getKey(table: TTables) {
		return `${this.prefix}:${table}`
	}

	select({ from, where, id, orderBy, pagination }: ISelectParams) {
		const data = JSON.parse(localStorage.getItem(this.getKey(from)) || '[]')

		let result = data

		if (id) {
			return result.find((item: any) => item.id === id)
		}

		if (where) {
			result = result.filter((item: any) => Object.keys(where).every((key) => item[key] === where[key]))
		}

		if (orderBy) {
			const { field, direction } = orderBy

			result = [...result].sort((a: any, b: any) => {
				if (a[field] < b[field]) return direction === 'asc' ? -1 : 1

				if (a[field] > b[field]) return direction === 'asc' ? 1 : -1

				return 0
			})
		}

		if (pagination) {
			result = result.slice(pagination.offset, pagination.limit ? pagination.offset + pagination.limit : undefined)
		}

		return result
	}

	insert({ into, data }: IInsertParams) {
		const existingData = JSON.parse(localStorage.getItem(this.getKey(into)) || '[]')

		const insertion = {
			id: crypto.randomUUID(),
			...data,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		const newData = [...existingData, insertion]

		localStorage.setItem(this.getKey(into), JSON.stringify(newData))

		return insertion as Record<string, any>
	}

	update({ from, where, data }: IUpdateParams) {
		const existingData = JSON.parse(localStorage.getItem(this.getKey(from)) || '[]')

		const updatedData = existingData.map((item: any) => {
			const match = Object.keys(where).every((k) => item[k] === where[k])

			return match ? { ...item, ...data } : item
		})

		localStorage.setItem(this.getKey(from), JSON.stringify(updatedData))

		return updatedData
	}

	delete({ from, id }: IDeleteParams) {
		const existingData = JSON.parse(localStorage.getItem(this.getKey(from)) || '[]')

		const filteredData = existingData.filter((item: any) => item.id !== id)

		localStorage.setItem(this.getKey(from), JSON.stringify(filteredData))
	}
}
