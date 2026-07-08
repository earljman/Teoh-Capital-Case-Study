import { SHIP_BLOCK_ORDER } from './compliance';

export type PackItem = { sku: string; qty: number };

export type PackDirective = {
	orderId: string;
	toteId: string;
	retailer: string;
	carton: string;
	dimensions: string;
	estimatedBillableLb: number;
	actualWeightLb: number;
	items: PackItem[];
	hints: {
		voidFill: string;
		placement: string;
		multiCarton: string;
		receivingNote: string;
	};
};

export const PACK_DIRECTIVE: PackDirective = {
	orderId: 'ORD-22941',
	toteId: 'TOTE-7812',
	retailer: 'Shopify DTC',
	carton: 'Box #4',
	dimensions: '12×9×6 in',
	estimatedBillableLb: 2.4,
	actualWeightLb: 2.1,
	items: [
		{ sku: 'SKU-44821', qty: 1 },
		{ sku: 'SKU-99201', qty: 2 }
	],
	hints: {
		voidFill: 'Light dunnage · kraft paper if needed',
		placement: 'Heavier items bottom · labels face up',
		multiCarton: 'Single carton order · split shipments not required',
		receivingNote: 'Missing dims? Capture at receiving before pack'
	}
};

export const PACK_COMPLIANCE_BLOCK = {
	orderId: SHIP_BLOCK_ORDER.po,
	toteId: 'TOTE-9014',
	partner: SHIP_BLOCK_ORDER.partner,
	violation: SHIP_BLOCK_ORDER.violation,
	fixAction: SHIP_BLOCK_ORDER.fixAction
};

export const OVERRIDE_REASONS = [
	'Box damaged',
	'Item too large',
	'Customer request',
	'Missing dimension — capture later'
] as const;

export type PackFlowStep = 'scan' | 'calculate' | 'directive' | 'weigh' | 'label';

export type PackerInstructions = {
	lead: string;
	actions: string[];
};

export const PACKER_INSTRUCTIONS = {
	scan: {
		lead: 'Load the order before you touch a box.',
		actions: [
			'Scan the barcode on the picked tote or order slip.',
			'Check that order and tote IDs match what appears on screen.',
			'Wait for the carton recommendation — do not guess a box size.'
		]
	},
	calculate: {
		lead: 'System is choosing the box — hold at the station.',
		actions: [
			'Keep the tote on the bench until the directive loads.',
			'Do not pre-pull a carton from the rack.',
			'If this takes more than a few seconds, tap a supervisor.'
		]
	},
	pack: {
		lead: 'Pack exactly to the directive below.',
		actions: [
			'Pull the highlighted carton from the rack.',
			'Verify every SKU and qty against the item list.',
			'Pack heaviest items on the bottom; add dunnage only if noted.',
			'Seal the carton, then tap Confirm pack.'
		]
	},
	gated: {
		lead: 'This order cannot ship — missing product data.',
		actions: [
			'Do not pack or label this order.',
			'Set the tote in the receiving hold area.',
			'Notify receiving to capture dimensions for the flagged SKU.',
			'Scan the next tote when the station is clear.'
		]
	},
	weigh: {
		lead: 'Weigh the sealed carton before printing a label.',
		actions: [
			'Place the sealed box centered on the shipping scale.',
			'Confirm the scale reading matches Actual weight on screen.',
			'If billable weight is higher, the carrier will charge DIM — note for next time.',
			'Tap Confirm weight when the reading is stable.'
		]
	},
	labelPrint: {
		lead: 'Print the label — compliance runs automatically.',
		actions: [
			'Double-check the retailer shown in the header.',
			'Tap Print shipping label and wait for the validator.',
			'Do not apply a label until you see pass or a fix action.'
		]
	},
	labelPass: {
		lead: 'Order cleared — finish at the dock.',
		actions: [
			'Apply the printed label per retailer routing guide.',
			'Stage the carton in the carrier pickup zone.',
			'Scan the next tote to start the next order.'
		]
	},
	labelBlock: {
		lead: 'Ship blocked — fix before the carton leaves the station.',
		actions: [
			'Do not stage or hand off this carton.',
			'Follow the fix action on screen (e.g. reprint label).',
			'Re-run Print shipping label after the fix.',
			'Call a supervisor if the block persists after one retry.'
		]
	},
	override: {
		lead: 'Using a different box — document why.',
		actions: [
			'Select the reason that best matches the situation.',
			'Pack in your chosen carton and seal it.',
			'Tap Confirm pack — override is logged for supervisor review.'
		]
	}
} as const satisfies Record<string, PackerInstructions>;
