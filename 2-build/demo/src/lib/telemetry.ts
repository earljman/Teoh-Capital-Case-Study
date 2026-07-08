import { writable } from 'svelte/store';

export type LiveExceptionRow = {
	id: string;
	time: string;
	type: string;
	entity: string;
	action: string;
};

/** Week 12: cross-route telemetry bus. Workflow screens emit; dashboards subscribe. */
export type TelemetrySnapshot = {
	laborSavedWeek: number;
	picksPerHour: number;
	walkDistanceSavedM: number;
	complianceRed: number;
	complianceYellow: number;
	complianceGreen: number;
	complianceExposure: number;
	dimWasteWeek: number;
	volumeUtilizationPct: number;
	inventoryAccuracyPct: number;
	picksCompleted: number;
	packsCompleted: number;
	syncQueue: number;
	batchActive: number;
	updatedAt: number;
	liveExceptions: LiveExceptionRow[];
};

export const DEFAULT_TELEMETRY: TelemetrySnapshot = {
	laborSavedWeek: 12_400,
	picksPerHour: 94,
	walkDistanceSavedM: 800,
	complianceRed: 2,
	complianceYellow: 5,
	complianceGreen: 41,
	complianceExposure: 2_100,
	dimWasteWeek: 4_200,
	volumeUtilizationPct: 92,
	inventoryAccuracyPct: 93,
	picksCompleted: 0,
	packsCompleted: 0,
	syncQueue: 7,
	batchActive: 12,
	updatedAt: Date.now(),
	liveExceptions: []
};

export const telemetry = writable<TelemetrySnapshot>({ ...DEFAULT_TELEMETRY });

function nowTime(): string {
	const d = new Date();
	return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function prependException(
	exceptions: LiveExceptionRow[],
	row: Omit<LiveExceptionRow, 'id'>
): LiveExceptionRow[] {
	return [
		{ ...row, id: `${row.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
		...exceptions
	].slice(0, 12);
}

function stamp(t: TelemetrySnapshot): TelemetrySnapshot {
	return { ...t, updatedAt: Date.now() };
}

export function recordPickReroute(location: string): void {
	telemetry.update((t) => stamp({
		...t,
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Bin empty',
			entity: location,
			action: 'Auto-rerouted'
		})
	}));
}

export function recordPickComplete(walkSavedM = 67): void {
	telemetry.update((t) => stamp({
		...t,
		picksCompleted: t.picksCompleted + 1,
		walkDistanceSavedM: t.walkDistanceSavedM + walkSavedM,
		laborSavedWeek: t.laborSavedWeek + 18,
		picksPerHour: Math.min(120, t.picksPerHour + 0.2),
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Pick complete',
			entity: 'Batch 7',
			action: `+${walkSavedM}m walk saved`
		})
	}));
}

export function recordPackComplete(): void {
	telemetry.update((t) => stamp({
		...t,
		packsCompleted: t.packsCompleted + 1,
		dimWasteWeek: Math.max(3_800, t.dimWasteWeek - 12),
		volumeUtilizationPct: Math.min(96, t.volumeUtilizationPct + 0.3),
		inventoryAccuracyPct: Math.min(99, t.inventoryAccuracyPct + 0.05),
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Cartonization',
			entity: 'Pack 3',
			action: 'Optimal fill confirmed'
		})
	}));
}
