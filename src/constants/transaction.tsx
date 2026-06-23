import { CreditCard, QrCode, ScanBarcode } from 'lucide-react'

export const ETransactionOriginType = {
	'credit-card': {
		name: 'Cartão de crédito',
		icon: <CreditCard className="size-4" />,
	},
	pix: {
		name: 'PIX',
		icon: <QrCode className="size-4" />,
	},
	'bank-slip': {
		name: 'Boleto',
		icon: <ScanBarcode className="size-4" />,
	},
}
