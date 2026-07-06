export type BigThreeCardData = {
	id: 'labor' | 'compliance' | 'dim';
	title: string;
	primary: string;
	secondary: string;
	sparkline: number[];
	accent?: 'green' | 'red' | 'amber';
	muted?: boolean;
	mutedReason?: string;
	workflowHref: '/pick' | '/compliance' | '/pack';
	workflowLabel: string;
};

export type ExecutiveDashboardData = {
	siteLabel: string;
	periodLabel: string;
	lastRefreshed: string;
	cards: BigThreeCardData[];
	annualMarginProtected: number;
	aiFeaturesActive: number;
	aiFeaturesTotal: number;
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
			sparkline: [0.5, 0.48, 0.52, 0.44, 0.4, 0.38, 0.35],
			accent: 'green',
			workflowHref: '/compliance',
			workflowLabel: 'See compliance →'
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
	annualMarginProtected: 342_000,
	aiFeaturesActive: 3,
	aiFeaturesTotal: 3
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
					secondary: 'Cartonization gated'
				}
			: card
	),
	aiFeaturesActive: 2,
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
					secondary: '~$8.4K exposure · 2 ship blocks'
				}
			: card
	),
	annualMarginProtected: 318_000
};
