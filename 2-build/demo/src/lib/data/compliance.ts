export type ComplianceRule = {
	id: string;
	retailer: string;
	constraint: string;
	status: 'ambiguous' | 'approved' | 'pending';
	sourcePage: number;
};

export const COMPLIANCE_RULES: ComplianceRule[] = [
	{
		id: 'wmt-label-pos',
		retailer: 'Walmart',
		constraint: 'Shipping label must be on short end, 2–4 in from top edge',
		status: 'approved',
		sourcePage: 12
	},
	{
		id: 'wmt-pallet-h',
		retailer: 'Walmart',
		constraint: 'Pallet height ≤ 48 in including pallet',
		status: 'approved',
		sourcePage: 18
	},
	{
		id: 'hd-height',
		retailer: 'Home Depot',
		constraint: 'Case stack max 6 high for SKU class A',
		status: 'ambiguous',
		sourcePage: 7
	}
];

export const SHIP_BLOCK_ORDER = {
	po: 'PO-8842',
	retailer: 'Walmart',
	violation: 'Label position — must be on short end, 2–4 in from top',
	fixAction: 'Reprint label (template WMT-OTIF-2)'
};
