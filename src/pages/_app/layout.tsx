import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, Navigate, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

export const Route = createFileRoute('/_app')({
	component: AppLayout,
})

function AppLayout() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const { isAuthenticated, clearMemoryUser } = useAuthStore()
	const { location } = useRouterState()

	if (!isAuthenticated) {
		return <Navigate to="/sign-in" />
	}

	function handleSignOut() {
		queryClient.invalidateQueries()
		clearMemoryUser()
		navigate({ to: '/sign-in' })
	}

	return (
		<div className="h-screen flex flex-col">
			<nav className="px-10 py-6 flex justify-between items-center border-b">
				<Link to="/dashboard">
					<h1 className="text-xl font-bold">KONOMY</h1>
				</Link>
				<div className="flex items-center gap-2">
					<Button asChild variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}>
						<Link to="/dashboard">Dashboard</Link>
					</Button>
					<Button asChild variant={location.pathname === '/transactions' ? 'default' : 'ghost'}>
						<Link to="/transactions">Transações</Link>
					</Button>
					<Button asChild variant={location.pathname === '/accounts' ? 'default' : 'ghost'}>
						<Link to="/accounts">Contas</Link>
					</Button>
					<Button asChild variant={location.pathname === '/income-sources' ? 'default' : 'ghost'}>
						<Link to="/income-sources">Fontes de renda</Link>
					</Button>
					<Button variant="destructive" onClick={handleSignOut}>
						Sair
					</Button>
				</div>
			</nav>
			<div className="flex-1 h-full p-10 overflow-y-auto">
				<div className="max-w-[1200px] mx-auto h-full">
					<Outlet />
				</div>
			</div>
		</div>
	)
}
