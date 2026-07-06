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
		overrideRatePct: number;
		hygienePct: number;
		aiReady: boolean;
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
	friction: { syncQueue: 7, overrideRatePct: 3.2, hygienePct: 94, aiReady: true },
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
	friction: { syncQueue: 28, overrideRatePct: 8.1, hygienePct: 94, aiReady: true },
	exceptions: [
		{ time: '09:18', type: 'Ship block', entity: 'PO-8842', action: 'Blocked — label position' },
		{ time: '09:16', type: 'Ship block', entity: 'PO-8839', action: 'Blocked — pallet height' },
		{ time: '09:14', type: 'Bin empty', entity: 'A-12', action: 'Unresolved' }
	]
};
