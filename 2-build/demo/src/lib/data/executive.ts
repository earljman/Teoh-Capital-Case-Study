import type { DemoState } from '$lib/demo/types';

export type BigThreeCardData = {
	id: 'labor' | 'compliance' | 'dim';
	title: string;
	primary: string;
	secondary: string;
	microLine?: string;
	sparkline: number[];
	accent?: 'green' | 'red' | 'amber';
	muted?: boolean;
	mutedReason?: string;
	workflowHref: '/pick' | '/compliance' | '/pack';
	workflowLabel: string;
	/** Drill-down state — e.g. compliance always opens ship block */
	workflowState?: DemoState;
};

export type ExecutiveDashboardData = {
	siteLabel: string;
	periodLabel: string;
	lastRefreshed: string;
	cards: BigThreeCardData[];
	annualMarginProtected: number;
	hygieneNote?: string;
};

export const EXECUTIVE_HAPPY: ExecutiveDashboardData = {
	siteLabel: 'All locations',
	periodLabel: 'This week',
	lastRefreshed: '2m ago',
	cards: [
		{
			id: 'labor',
			title: 'Labor saved',
			primary: '$12,400 this wk',
			secondary: '94 picks/hr · ↑18% vs baseline',
			sparkline: [0.3, 0.35, 0.42, 0.55, 0.62, 0.78, 0.94],
			accent: 'green',
			workflowHref: '/pick',
			workflowLabel: 'See pick-path →'
		},
		{
			id: 'compliance',
			title: 'Compliance risk',
			primary: '2R · 5Y · 41G',
			secondary: '~$2.1K exposure',
			microLine: 'OTIF at-risk today: 7',
			sparkline: [0.5, 0.48, 0.52, 0.44, 0.4, 0.38, 0.35],
			accent: 'green',
			workflowHref: '/compliance',
			workflowLabel: 'See compliance →',
			workflowState: 'alert'
		},
		{
			id: 'dim',
			title: 'DIM waste',
			primary: '$4,200 lost/wk',
			secondary: '18% vs. optimal fill',
			sparkline: [0.7, 0.68, 0.65, 0.58, 0.52, 0.48, 0.42],
			accent: 'amber',
			workflowHref: '/pack',
			workflowLabel: 'See cartonization →'
		}
	],
	annualMarginProtected: 342_000
};

export const EXECUTIVE_GATED: ExecutiveDashboardData = {
	...EXECUTIVE_HAPPY,
	cards: EXECUTIVE_HAPPY.cards.map((card) =>
		card.id === 'dim'
			? {
					...card,
					muted: true,
					mutedReason: 'Blocked — master data hygiene below 90%',
					primary: '—',
					secondary: 'Cartonization gated',
					workflowState: 'gated' as const
				}
			: card
	),
	hygieneNote: 'SKU dimension coverage at 87% — cartonization inactive'
};

export const EXECUTIVE_ALERT: ExecutiveDashboardData = {
	...EXECUTIVE_HAPPY,
	cards: EXECUTIVE_HAPPY.cards.map((card) =>
		card.id === 'compliance'
			? {
					...card,
					accent: 'red' as const,
					primary: '4R · 8Y · 36G',
					secondary: '~$8.4K exposure · 2 ship blocks',
					microLine: 'OTIF at-risk today: 14'
				}
			: card
	),
	annualMarginProtected: 318_000
};
