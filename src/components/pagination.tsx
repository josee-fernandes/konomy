import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface IPaginationProps {
	page: number
	total: number
	perPage: number
	onPageChange: (page: number) => void
}

export function Pagination({ page, total, perPage, onPageChange }: IPaginationProps) {
	const pages = Math.ceil(total / perPage) || 1

	return (
		<div className="flex items-center justify-between">
			<p>
				Página {page} de {pages}
			</p>
			<div className="flex items-center gap-2">
				<Button variant="outline" size="icon" disabled={page === 1} onClick={() => onPageChange(1)}>
					<ChevronsLeft className="size-4" />
				</Button>
				<Button variant="outline" size="icon" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
					<ChevronLeft className="size-4" />
				</Button>

				<Button variant="outline" size="icon" disabled={page === pages} onClick={() => onPageChange(page + 1)}>
					<ChevronRight className="size-4" />
				</Button>
				<Button variant="outline" size="icon" disabled={page === pages} onClick={() => onPageChange(pages)}>
					<ChevronsRight className="size-4" />
				</Button>
			</div>
		</div>
	)
}
