import { writable } from 'svelte/store';

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
	picksCompleted: number;
	packsCompleted: number;
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
	volumeUtilizationPct: 82,
	picksCompleted: 0,
	packsCompleted: 0
};

export const telemetry = writable<TelemetrySnapshot>({ ...DEFAULT_TELEMETRY });

export function recordPickComplete(walkSavedM = 67): void {
	telemetry.update((t) => ({
		...t,
		picksCompleted: t.picksCompleted + 1,
		walkDistanceSavedM: t.walkDistanceSavedM + walkSavedM,
		laborSavedWeek: t.laborSavedWeek + 18,
		picksPerHour: Math.min(120, t.picksPerHour + 0.2)
	}));
}

export function recordPackComplete(): void {
	telemetry.update((t) => ({
		...t,
		packsCompleted: t.packsCompleted + 1,
		dimWasteWeek: Math.max(3_800, t.dimWasteWeek - 12),
		volumeUtilizationPct: Math.min(96, t.volumeUtilizationPct + 0.3)
	}));
}
