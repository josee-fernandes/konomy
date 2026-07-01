import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/income-sources')({
	component: IncomeSourcesPage,
	head: () => ({
		meta: [
			{ title: 'Konomy | Fontes de renda' },
			{ name: 'description', content: 'Página de fontes de renda do Konomy para gerenciar suas fontes de renda' },
		],
	}),
})

function IncomeSourcesPage() {
	return <div>TODO</div>
}
