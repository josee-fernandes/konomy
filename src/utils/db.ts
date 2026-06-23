interface ISelectParams {
	from: string
	scope?: 'all' | 'byId'
	where?: Record<string, any>
	id?: string
}

interface IInsertParams {
	into: string
	data: Record<string, any>
}

interface IUpdateParams {
	from: string
	id: string
	data: Record<string, any>
}

interface IDeleteParams {
	from: string
	id: string
}

export class LSDB {
	private prefix: string = '@konomy:'

	constructor() {}

	select({ from, scope = 'all', id, where }: ISelectParams) {
		const data = JSON.parse(localStorage.getItem(`${this.prefix}:${from}`) || '[]')
		if (scope === 'all') return data
		if (where) {
			return data.filter((item: any) => Object.keys(where).every((key) => item[key] === where[key]))
		}
		return data.find((item: any) => item.id === id)
	}

	insert({ into, data }: IInsertParams) {
		const existingData = JSON.parse(localStorage.getItem(`${this.prefix}:${into}`) || '[]')
		const insertion = { id: crypto.randomUUID(), ...data }
		const newData = [...existingData, insertion]
		localStorage.setItem(`${this.prefix}:${into}`, JSON.stringify(newData))
		return insertion as Record<string, any>
	}

	update({ from, id, data }: IUpdateParams) {
		const existingData = JSON.parse(localStorage.getItem(`${this.prefix}:${from}`) || '[]')
		const updatedData = existingData.map((item: any) => (item.id === id ? { ...item, ...data } : item))
		localStorage.setItem(`${this.prefix}:${from}`, JSON.stringify(updatedData))
		return updatedData
	}

	delete({ from, id }: IDeleteParams) {
		const existingData = JSON.parse(localStorage.getItem(`${this.prefix}:${from}`) || '[]')
		const filteredData = existingData.filter((item: any) => item.id !== id)
		localStorage.setItem(from, JSON.stringify(filteredData))
	}
}
