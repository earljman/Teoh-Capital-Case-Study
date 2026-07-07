import type { DemoState } from '$lib/demo/types';

export type TopMetricViz =
	| { kind: 'sparkline'; values: number[] }
	| { kind: 'bars'; values: number[]; warnFrom?: number }
	| { kind: 'gauge'; value: number; threshold?: number }
	| { kind: 'baseline'; values: number[]; baseline: number }
	| { kind: 'timeline'; days: ('good' | 'warn' | 'critical')[] };

export type TopMetric = {
	id: 'labor' | 'compliance' | 'dim' | 'otif' | 'inventory' | 'override';
	label: string;
	value: string;
	tone?: 'neutral' | 'good' | 'warn' | 'critical';
	viz: TopMetricViz;
};

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
	topMetrics: TopMetric[];
	portfolioTrend: {
		weeks: string[];
		labor: number[];
		compliance: number[];
		dim: number[];
	};
	annualMarginProtected: number;
	hygieneNote?: string;
};

const HAPPY_TOP_METRICS: TopMetric[] = [
	{
		id: 'labor',
		label: 'Labor saved',
		value: '$12.4K/wk',
		tone: 'good',
		viz: { kind: 'sparkline', values: [0.3, 0.35, 0.42, 0.55, 0.62, 0.78, 0.94] }
	},
	{
		id: 'compliance',
		label: 'Chargeback exposure',
		value: '$2.1K',
		tone: 'warn',
		viz: { kind: 'bars', values: [3.2, 2.8, 2.5, 2.3, 2.1, 2.0, 2.1], warnFrom: 2.5 }
	},
	{
		id: 'dim',
		label: 'DIM waste',
		value: '$4.2K/wk',
		tone: 'warn',
		viz: { kind: 'sparkline', values: [0.7, 0.68, 0.65, 0.58, 0.52, 0.48, 0.42] }
	},
	{
		id: 'otif',
		label: 'OTIF at-risk',
		value: '7 shipments',
		tone: 'warn',
		viz: {
			kind: 'timeline',
			days: ['good', 'good', 'warn', 'good', 'warn', 'warn', 'warn']
		}
	},
	{
		id: 'inventory',
		label: 'A-item accuracy',
		value: '93%',
		tone: 'neutral',
		viz: { kind: 'gauge', value: 93, threshold: 90 }
	},
	{
		id: 'override',
		label: 'Override rate',
		value: '3.2%',
		tone: 'neutral',
		viz: { kind: 'baseline', values: [0.042, 0.038, 0.035, 0.034, 0.033, 0.032, 0.032], baseline: 0.04 }
	}
];

const PORTFOLIO_TREND = {
	weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
	labor: [8.2, 9.1, 9.8, 10.4, 11.2, 11.8, 12.1, 12.4],
	compliance: [1.2, 1.4, 1.6, 1.5, 1.8, 1.9, 2.0, 2.1],
	dim: [5.8, 5.4, 5.1, 4.9, 4.6, 4.4, 4.3, 4.2]
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
	topMetrics: HAPPY_TOP_METRICS,
	portfolioTrend: PORTFOLIO_TREND,
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
	topMetrics: HAPPY_TOP_METRICS.map((metric) =>
		metric.id === 'dim'
			? { ...metric, value: 'Gated', tone: 'critical' as const, viz: { kind: 'sparkline' as const, values: [0, 0, 0, 0, 0, 0, 0] } }
			: metric.id === 'inventory'
				? {
						...metric,
						value: '87%',
						tone: 'critical' as const,
						viz: { kind: 'gauge' as const, value: 87, threshold: 90 }
					}
				: metric
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
	topMetrics: HAPPY_TOP_METRICS.map((metric) => {
		switch (metric.id) {
			case 'compliance':
				return {
					...metric,
					value: '$8.4K',
					tone: 'critical' as const,
					viz: { kind: 'bars' as const, values: [2.1, 2.8, 3.5, 4.2, 5.6, 7.1, 8.4], warnFrom: 4 }
				};
			case 'otif':
				return {
					...metric,
					value: '14 shipments',
					tone: 'critical' as const,
					viz: {
						kind: 'timeline' as const,
						days: ['good', 'warn', 'warn', 'critical', 'warn', 'critical', 'critical']
					}
				};
			case 'override':
				return {
					...metric,
					value: '8.1%',
					tone: 'warn' as const,
					viz: {
						kind: 'baseline' as const,
						values: [0.032, 0.038, 0.045, 0.052, 0.061, 0.074, 0.081],
						baseline: 0.04
					}
				};
			default:
				return metric;
		}
	}),
	annualMarginProtected: 318_000
};
