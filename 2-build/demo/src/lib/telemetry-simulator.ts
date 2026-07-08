import { telemetry, type TelemetrySnapshot, type LiveExceptionRow } from '$lib/telemetry';

const INTERVAL_MS = 3000;

const BINS = ['A-12', 'B-44', 'C-08', 'D-22', 'E-03', 'F-17', 'G-31'];
const BATCHES = ['Batch 4', 'Batch 7', 'Batch 9', 'Batch 12'];
const PACK_STATIONS = ['Pack 1', 'Pack 2', 'Pack 3', 'Pack 5'];

let timer: ReturnType<typeof setInterval> | null = null;
let running = false;

function pick<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

function rand(min: number, max: number): number {
	return Math.floor(min + Math.random() * (max - min + 1));
}

function nowTime(): string {
	const d = new Date();
	return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function prependException(
	exceptions: LiveExceptionRow[],
	row: Omit<LiveExceptionRow, 'id'>
): LiveExceptionRow[] {
	return [{ ...row, id: `sim-${row.type}-${Date.now()}` }, ...exceptions].slice(0, 8);
}

type SimEvent = (t: TelemetrySnapshot) => TelemetrySnapshot;

const SIM_EVENTS: SimEvent[] = [
	(t) => {
		const walk = rand(35, 72);
		return {
			...t,
			picksCompleted: t.picksCompleted + 1,
			laborSavedWeek: t.laborSavedWeek + rand(14, 22),
			walkDistanceSavedM: t.walkDistanceSavedM + walk,
			picksPerHour: Math.min(120, +(t.picksPerHour + 0.15).toFixed(1)),
			liveExceptions: prependException(t.liveExceptions, {
				time: nowTime(),
				type: 'Pick complete',
				entity: pick(BATCHES),
				action: `+${walk}m walk saved`
			})
		};
	},
	(t) => ({
		...t,
		packsCompleted: t.packsCompleted + 1,
		dimWasteWeek: Math.max(3_800, t.dimWasteWeek - rand(8, 16)),
		volumeUtilizationPct: Math.min(96, +(t.volumeUtilizationPct + 0.2).toFixed(1)),
		inventoryAccuracyPct: Math.min(99, +(t.inventoryAccuracyPct + 0.04).toFixed(2)),
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Cartonization',
			entity: pick(PACK_STATIONS),
			action: 'Optimal fill confirmed'
		})
	}),
	(t) => ({
		...t,
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Bin empty',
			entity: pick(BINS),
			action: 'Auto-rerouted'
		})
	}),
	(t) => ({
		...t,
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Barcode',
			entity: pick(BINS),
			action: 'Rescan OK'
		})
	}),
	(t) => ({
		...t,
		complianceExposure: Math.max(1_800, t.complianceExposure + rand(-120, 90)),
		complianceYellow: Math.max(3, Math.min(8, t.complianceYellow + rand(-1, 1))),
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Override',
			entity: pick(['Zone B', 'Zone C', 'Picker 8']),
			action: 'Force-confirm flagged'
		})
	}),
	(t) => ({
		...t,
		picksPerHour: Math.min(120, +(t.picksPerHour + 0.1).toFixed(1)),
		laborSavedWeek: t.laborSavedWeek + rand(8, 14),
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Sync',
			entity: pick(['Zone D', 'Zone F']),
			action: 'Queue cleared'
		})
	})
];

function emitRandomEvent(): void {
	telemetry.update((t) => pick(SIM_EVENTS)(t));
}

/** Background floor events for live dashboard demos — paused in screenshot mode. */
export function startTelemetrySimulator(): void {
	if (running) return;
	running = true;
	timer = setInterval(emitRandomEvent, INTERVAL_MS);
}

export function stopTelemetrySimulator(): void {
	running = false;
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
}

export function isTelemetrySimulatorRunning(): boolean {
	return running;
}
