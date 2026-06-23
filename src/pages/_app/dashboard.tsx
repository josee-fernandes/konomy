import { createFileRoute } from '@tanstack/react-router'

import { useAuthStore } from '@/stores/auth'

export const Route = createFileRoute('/_app/dashboard')({
	component: DashboardPage,
	head: () => ({
		meta: [
			{ title: 'Konomy | Dashboard' },
			{ name: 'description', content: 'Dashboard of Konomy to manage your finances' },
		],
	}),
})

function DashboardPage() {
	const { user } = useAuthStore()

	return (
		<div className="max-w-[1200px] mx-auto p-10">
			<pre>{JSON.stringify(user, null, 2)}</pre>
		</div>
	)
}
