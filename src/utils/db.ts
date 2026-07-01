type TPrimitive = 'string' | 'number' | 'boolean' | 'date' | 'array'

interface ISchemaObject {
	[key: string]: TPrimitive
}

type TSchemaValue = TPrimitive | ISchemaObject

type TPrimitiveMap = {
	string: string
	number: number
	boolean: boolean
	date: Date
	array: any[]
	object: object
}

type TInferTable<T extends Record<string, TSchemaValue>> = {
	[K in keyof T]: T[K] extends keyof TPrimitiveMap
		? TPrimitiveMap[T[K]]
		: T[K] extends ISchemaObject
			? TInferTable<T[K]>
			: never
}

type TSchemaDefinition = Record<string, Record<string, TSchemaValue>>

type TTableDefinition<TSchema extends TSchemaDefinition, TTable extends keyof TSchema> = TInferTable<TSchema[TTable]>

type TPersistedTable<TSchema extends TSchemaDefinition, TTable extends keyof TSchema> = TTableDefinition<
	TSchema,
	TTable
> & {
	id: string
	createdAt: string
	updatedAt: string
}

interface ISelectParams<TSchema extends TSchemaDefinition, TTable extends keyof TSchema> {
	from: TTable
	where?: Partial<TPersistedTable<TSchema, TTable>>
	id?: string
	pagination?: {
		limit?: number
		offset: number
	}
	orderBy?: {
		field: keyof TPersistedTable<TSchema, TTable>
		direction: 'asc' | 'desc'
	}
}

type TInsertTable<TSchema extends TSchemaDefinition, TTable extends keyof TSchema> = TTableDefinition<TSchema, TTable>

interface IInsertParams<TSchema extends TSchemaDefinition, TTable extends keyof TSchema> {
	into: TTable
	data: TInsertTable<TSchema, TTable>
}

type TUpdateTable<TSchema extends TSchemaDefinition, TTable extends keyof TSchema> = TTableDefinition<TSchema, TTable>

interface IUpdateParams<TSchema extends TSchemaDefinition, TTable extends keyof TSchema> {
	from: TTable
	where: Partial<TPersistedTable<TSchema, TTable>>
	data: Partial<TUpdateTable<TSchema, TTable>>
}

interface IDeleteParams<TSchema extends TSchemaDefinition, TTable extends keyof TSchema> {
	from: TTable
	id: string
}

interface ILSDBParams<TSchema extends TSchemaDefinition> {
	name: string
	prefix?: string
	schema: TSchema
}

export class LSDB<TSchema extends TSchemaDefinition> {
	private prefix: string

	constructor({ name, prefix }: ILSDBParams<TSchema>) {
		this.prefix = prefix ? `${prefix}:` : `@lsdb.${name}:`
	}

	private getKey(table: keyof TSchema) {
		return `${this.prefix}:${String(table)}`
	}

	async select<TTable extends keyof TSchema>(
		params: ISelectParams<TSchema, TTable> & {
			id: string
		},
	): Promise<TPersistedTable<TSchema, TTable> | undefined>

	async select<TTable extends keyof TSchema>(
		params: ISelectParams<TSchema, TTable>,
	): Promise<TPersistedTable<TSchema, TTable>[]>

	async select<TTable extends keyof TSchema>({
		from,
		where,
		id,
		orderBy = { field: 'createdAt', direction: 'desc' },
		pagination,
	}: ISelectParams<TSchema, TTable>) {
		const data = JSON.parse(localStorage.getItem(this.getKey(from)) || '[]') as TPersistedTable<TSchema, TTable>[]

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

	async insert<TTable extends keyof TSchema>({
		into,
		data,
	}: IInsertParams<TSchema, TTable>): Promise<TPersistedTable<TSchema, TTable>> {
		const existingData = JSON.parse(localStorage.getItem(this.getKey(into)) || '[]')

		const insertion: TPersistedTable<TSchema, TTable> = {
			id: crypto.randomUUID(),
			...data,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		const newData = [...existingData, insertion]

		localStorage.setItem(this.getKey(into), JSON.stringify(newData))

		return insertion
	}

	async update<TTable extends keyof TSchema>({
		from,
		where,
		data,
	}: IUpdateParams<TSchema, TTable>): Promise<TPersistedTable<TSchema, TTable>[]> {
		const existingData = JSON.parse(localStorage.getItem(this.getKey(from)) || '[]') as TPersistedTable<
			TSchema,
			TTable
		>[]

		const updatedData = existingData.map((item: TPersistedTable<TSchema, TTable>) => {
			const match = Object.keys(where).every((k) => item[k] === where[k])

			return match ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
		})

		localStorage.setItem(this.getKey(from), JSON.stringify(updatedData))

		return updatedData
	}

	async delete<TTable extends keyof TSchema>({ from, id }: IDeleteParams<TSchema, TTable>): Promise<void> {
		const existingData = JSON.parse(localStorage.getItem(this.getKey(from)) || '[]') as TPersistedTable<
			TSchema,
			TTable
		>[]

		const filteredData = existingData.filter((item: TPersistedTable<TSchema, TTable>) => item.id !== id)

		localStorage.setItem(this.getKey(from), JSON.stringify(filteredData))
	}
}
