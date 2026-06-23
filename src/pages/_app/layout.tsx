import { createFileRoute, Navigate, Outlet, useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

export const Route = createFileRoute('/_app')({
	component: AppLayout,
})

function AppLayout() {
	const navigate = useNavigate()
	const { isAuthenticated, clearMemoryUser } = useAuthStore()

	if (!isAuthenticated) {
		return <Navigate to="/sign-in" />
	}

	function handleSignOut() {
		clearMemoryUser()
		navigate({ to: '/sign-in' })
	}

	return (
		<div>
			<nav>
				<Button variant="destructive" onClick={handleSignOut}>
					Sign Out
				</Button>
			</nav>
			<Outlet />
		</div>
	)
}
