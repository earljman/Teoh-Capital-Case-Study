export const ROUTING_GUIDE = {
	partner: 'D&H',
	title: 'US Domestic Supplier Routing Guide',
	effectiveDate: 'May 1, 2022',
	filename: 'US-DomesticSupplierRoutingGuide.pdf',
	pdfUrl: '/research/US-DomesticSupplierRoutingGuide.pdf',
	dcTag: 'Branch 5 · Chicago',
	extractedCount: 47,
	ambiguousCount: 3
} as const;

export const DH_DC_OPTIONS = [
	'Branch 1 · Middletown',
	'Branch 4 · Fresno',
	'Branch 5 · Chicago',
	'Branch 6 · Atlanta/Newnan'
] as const;

export type ComplianceRule = {
	id: string;
	partner: string;
	constraint: string;
	status: 'ambiguous' | 'approved' | 'pending';
	sourcePage: number;
	sourceSnippet: string;
	penaltyCode?: string;
	activatedFor: string[];
};

export const COMPLIANCE_RULES: ComplianceRule[] = [
	{
		id: 'dh-po-label',
		partner: 'D&H',
		constraint: 'PO # must be legibly printed on the ship label',
		status: 'approved',
		sourcePage: 6,
		sourceSnippet:
			'PO # must be legibly printed on the ship label. Model # and quantity in the carton must be on the carton or on the label.',
		penaltyCode: 'W09 · $100',
		activatedFor: ['Branch 5 · Chicago']
	},
	{
		id: 'dh-pallet-height',
		partner: 'D&H',
		constraint: 'Pallet height ≤ 72 in, or ≤ 48 in if stackable',
		status: 'approved',
		sourcePage: 6,
		sourceSnippet:
			'Pallets must be 48x40 Minimum, Grade B Wood for Ground LTL or truckload. Must Be 4 Way Access and NO BLOCK PALLETS. Pallets should not exceed 72" in height or 48" if stackable.',
		activatedFor: ['Branch 5 · Chicago']
	},
	{
		id: 'dh-carton-count',
		partner: 'D&H',
		constraint: 'Box number noted on carton or label (1 of 5, etc.)',
		status: 'ambiguous',
		sourcePage: 6,
		sourceSnippet:
			'Box number should be noted either on the carton or on the label (1 of 5, 1 of 10, etc).',
		penaltyCode: 'W11 · $1/carton',
		activatedFor: []
	}
];

export const SHIP_BLOCK_ORDER = {
	po: 'PO-8842',
	partner: 'D&H · Branch 5',
	violation: 'PO # missing or illegible on shipping label (W09 · $100)',
	fixAction: 'Reprint label with PO #'
} as const;

export function hasActiveRules(rules: ComplianceRule[], dc = ROUTING_GUIDE.dcTag): boolean {
	return rules.some((rule) => rule.status === 'approved' && rule.activatedFor.includes(dc));
}

/** Gated fixture: approved rules present but none activated for the tagged DC. */
export const COMPLIANCE_RULES_GATED: ComplianceRule[] = COMPLIANCE_RULES.map((rule) => ({
	...rule,
	activatedFor: []
}));
