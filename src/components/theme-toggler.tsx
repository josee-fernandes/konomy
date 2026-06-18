import { Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggler() {
	const { theme, setTheme } = useTheme()

	const handleThemeToggle = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')

		toast.success(`Theme set to ${theme === 'dark' ? 'light' : 'dark'}`)
	}

	return (
		<Button variant="outline" size="icon" onClick={handleThemeToggle}>
			<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
