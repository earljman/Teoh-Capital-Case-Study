export type ActionQueueItem = {
	label: string;
	count: number;
	severity: 'neutral' | 'warn' | 'critical';
};

export type ExceptionRow = {
	time: string;
	type: string;
	entity: string;
	action: string;
};

export type SupervisorDashboardData = {
	siteLabel: string;
	shiftLabel: string;
	lastRefreshed: string;
	actionQueue: ActionQueueItem[];
	allClear: boolean;
	batch: {
		active: number;
		clusters: number;
		walkKmSaved: number;
	};
	cartonization: {
		utilizationPct: number;
		blocked: boolean;
	};
	heatmapHotZone: string;
	heatmapPickers: number;
	friction: {
		syncQueue: number;
		syncQueueHourly: number[];
		overrideRatePct: number;
		overrideApprovedPct: number;
		overrideFlaggedPct: number;
		overrideBaselinePct: number;
		overrideTrend: number[];
		hygienePct: number;
		inventoryAccuracyPct: number;
		oldestUnsyncedMinutes: number;
	};
	unresolvedAgingCount: number;
	exceptionAgingBuckets: { label: string; count: number; tone?: 'neutral' | 'warn' | 'critical' }[];
	deferredMetrics: {
		dockToStockHoursAvg: number;
		dockToStockTrend: number[];
		phantomRiskPct: number;
		phantomRiskTrend: number[];
	};
	exceptions: ExceptionRow[];
	aiLog: { time: string; kind: string; message: string }[];
};

export const SUPERVISOR_HAPPY: SupervisorDashboardData = {
	siteLabel: 'DC-04 Reno',
	shiftLabel: 'Shift 1 · Today',
	lastRefreshed: '1m ago',
	actionQueue: [
		{ label: 'Ship blocks', count: 0, severity: 'neutral' },
		{ label: 'Compliance holds', count: 0, severity: 'neutral' },
		{ label: 'Sync dead zones', count: 0, severity: 'neutral' },
		{ label: 'Open exceptions', count: 2, severity: 'neutral' }
	],
	allClear: true,
	batch: { active: 12, clusters: 3, walkKmSaved: 4.2 },
	cartonization: { utilizationPct: 92, blocked: false },
	heatmapHotZone: 'Zone C',
	heatmapPickers: 4,
	friction: {
		syncQueue: 7,
		syncQueueHourly: [3, 4, 5, 6, 8, 6, 7],
		overrideRatePct: 3.2,
		overrideApprovedPct: 2.7,
		overrideFlaggedPct: 0.5,
		overrideBaselinePct: 4.0,
		overrideTrend: [0.038, 0.036, 0.034, 0.033, 0.032, 0.032, 0.032],
		hygienePct: 94,
		inventoryAccuracyPct: 93,
		oldestUnsyncedMinutes: 11
	},
	unresolvedAgingCount: 0,
	exceptionAgingBuckets: [
		{ label: '<15m', count: 2, tone: 'neutral' },
		{ label: '15-30m', count: 0, tone: 'warn' },
		{ label: '>30m', count: 0, tone: 'critical' }
	],
	deferredMetrics: {
		dockToStockHoursAvg: 14,
		dockToStockTrend: [18, 17, 16, 15, 15, 14, 14],
		phantomRiskPct: 3.2,
		phantomRiskTrend: [4.1, 3.9, 3.7, 3.5, 3.4, 3.3, 3.2]
	},
	exceptions: [
		{ time: '09:14', type: 'Bin empty', entity: 'A-12', action: 'Auto-rerouted' },
		{ time: '09:11', type: 'Override', entity: 'Zone B', action: 'Force-confirm flagged' },
		{ time: '09:08', type: 'Pick complete', entity: 'Batch 7', action: '4.2km saved (shift)' }
	],
	aiLog: [
		{ time: '09:12', kind: 'GUIDE', message: 'Home Depot Guide v3.2 — height limit constraint set' },
		{ time: '09:05', kind: 'PATH', message: 'Pathing index 87% vs. optimized baseline (shift)' }
	]
};

export const SUPERVISOR_ALERT: SupervisorDashboardData = {
	...SUPERVISOR_HAPPY,
	allClear: false,
	actionQueue: [
		{ label: 'Ship blocks', count: 3, severity: 'critical' },
		{ label: 'Compliance holds', count: 2, severity: 'critical' },
		{ label: 'Sync dead zones', count: 1, severity: 'warn' },
		{ label: 'Open exceptions', count: 5, severity: 'warn' }
	],
	friction: {
		syncQueue: 28,
		syncQueueHourly: [8, 12, 16, 20, 24, 26, 28],
		overrideRatePct: 8.1,
		overrideApprovedPct: 6.4,
		overrideFlaggedPct: 1.7,
		overrideBaselinePct: 4.0,
		overrideTrend: [0.032, 0.041, 0.052, 0.061, 0.068, 0.075, 0.081],
		hygienePct: 94,
		inventoryAccuracyPct: 89,
		oldestUnsyncedMinutes: 37
	},
	unresolvedAgingCount: 2,
	exceptionAgingBuckets: [
		{ label: '<15m', count: 2, tone: 'neutral' },
		{ label: '15-30m', count: 1, tone: 'warn' },
		{ label: '>30m', count: 2, tone: 'critical' }
	],
	deferredMetrics: {
		dockToStockHoursAvg: 17,
		dockToStockTrend: [14, 14, 15, 15, 16, 16, 17],
		phantomRiskPct: 4.8,
		phantomRiskTrend: [3.2, 3.5, 3.8, 4.0, 4.3, 4.6, 4.8]
	},
	exceptions: [
		{ time: '09:18', type: 'Ship block', entity: 'PO-8842', action: 'Blocked — label position' },
		{ time: '09:16', type: 'Ship block', entity: 'PO-8839', action: 'Blocked — pallet height' },
		{ time: '09:14', type: 'Bin empty', entity: 'A-12', action: 'Unresolved' }
	]
};
