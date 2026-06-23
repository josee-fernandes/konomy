interface IInfoCardProps {
	title: string
	icon: React.ReactNode
	highlight: string
}

export function InfoCard({ title, icon, highlight }: IInfoCardProps) {
	return (
		<div className="bg-card p-4 rounded-lg sm:max-w-96 flex flex-col gap-2 border">
			<div className="flex items-center justify-between">
				<h3>{title}</h3>
				<div>{icon}</div>
			</div>
			<div>
				<p className="text-2xl font-bold">{highlight}</p>
			</div>
		</div>
	)
}
