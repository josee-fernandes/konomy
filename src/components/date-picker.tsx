import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { fromIsoDateString, toIsoDateString } from '@/utils/date'

interface IDatePickerProps {
	value?: string
	onChange: (value: string) => void
	id?: string
	placeholder?: string
	className?: string
	'aria-invalid'?: boolean
}

export function DatePicker({
	value,
	onChange,
	id,
	placeholder = 'Selecione uma data',
	className,
	'aria-invalid': ariaInvalid,
}: IDatePickerProps) {
	const [open, setOpen] = useState(false)
	const date = value ? fromIsoDateString(value) : undefined

	function handleSelect(selectedDate: Date | undefined) {
		if (selectedDate) {
			onChange(toIsoDateString(selectedDate))
			setOpen(false)
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					id={id}
					type="button"
					variant="outline"
					data-empty={!date}
					aria-invalid={ariaInvalid}
					className={cn(
						'w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground',
						className,
					)}
				>
					{date ? format(date, 'PPP', { locale: ptBR }) : <span>{placeholder}</span>}
					<ChevronDownIcon className="size-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar mode="single" selected={date} onSelect={handleSelect} defaultMonth={date} />
			</PopoverContent>
		</Popover>
	)
}
