export type PackDirective = {
	orderId: string;
	carton: string;
	dimensions: string;
	billableWeight: string;
	items: { sku: string; qty: number }[];
};

export const PACK_DIRECTIVE: PackDirective = {
	orderId: 'ORD-22941',
	carton: 'Box #4',
	dimensions: '12×9×6 in',
	billableWeight: '2.4 lb ✓',
	items: [
		{ sku: 'SKU-44821', qty: 1 },
		{ sku: 'SKU-99201', qty: 2 }
	]
};

export const OVERRIDE_REASONS = [
	'Box damaged',
	'Item too large',
	'Customer request',
	'Missing dimension — capture later'
] as const;
