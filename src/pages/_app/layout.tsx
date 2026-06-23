import { createFileRoute, Link, Navigate, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

export const Route = createFileRoute('/_app')({
	component: AppLayout,
})

function AppLayout() {
	const navigate = useNavigate()
	const { isAuthenticated, clearMemoryUser } = useAuthStore()
	const { location } = useRouterState()

	if (!isAuthenticated) {
		return <Navigate to="/sign-in" />
	}

	function handleSignOut() {
		clearMemoryUser()
		navigate({ to: '/sign-in' })
	}

	return (
		<div>
			<nav className="px-10 py-6 flex justify-between items-center">
				<Link to="/dashboard">
					<h1 className="text-xl font-bold">KONOMY</h1>
				</Link>
				<div className="flex items-center gap-2">
					<Button asChild variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}>
						<Link to="/dashboard">Dashboard</Link>
					</Button>
					<Button asChild variant={location.pathname === '/transactions' ? 'default' : 'ghost'}>
						<Link to="/transactions">Transactions</Link>
					</Button>
					<Button variant="destructive" onClick={handleSignOut}>
						Sign Out
					</Button>
				</div>
			</nav>
			<div className="max-w-[1200px] mx-auto p-10">
				<Outlet />
			</div>
		</div>
	)
}
