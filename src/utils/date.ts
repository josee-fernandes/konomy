import { formatISO, isValid, parse, parseISO } from 'date-fns'

export function fromIsoDateString(iso: string) {
	const date = parse(iso.slice(0, 10), 'yyyy-MM-dd', new Date())

	return isValid(date) ? date : undefined
}

export function toIsoDateString(date: Date) {
	return parseISO(formatISO(date, { representation: 'date' })).toISOString()
}
