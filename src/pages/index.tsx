import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
	component: HomePage,
	head: () => ({
		meta: [{ title: 'Konomy' }, { name: 'description', content: 'Konomy is a platform for managing your finances' }],
	}),
})

function HomePage() {
	return (
		<div className="h-screen max-w-[1200px] mx-auto p-10 grid place-items-center">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-black">KONOMY</h1>
				<p>Konomy é uma plataforma para gerenciar suas finanças.</p>
				<div className="flex gap-2 items-center">
					<Button asChild className="flex-1 group">
						<Link to="/sign-up">
							Me cadastrar{' '}
							<ArrowRightIcon className="size-4 translate-x-0 w-0 group-hover:w-4 opacity-0 group-hover:translate-x-2 group-hover:opacity-100 transition-all" />
						</Link>
					</Button>
					<p className="text-center">ou</p>
					<Button variant="outline" asChild className="flex-1 group">
						<Link to="/sign-in">
							Entrar{' '}
							<ArrowRightIcon className="size-4 translate-x-0 w-0 group-hover:w-4 opacity-0 group-hover:translate-x-2 group-hover:opacity-100 transition-all" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
