import { telemetry, type TelemetrySnapshot, type LiveExceptionRow } from '$lib/telemetry';

const INTERVAL_MS = 1100;
const BURST_CHANCE = 0.28;

const BINS = ['A-12', 'B-44', 'C-08', 'D-22', 'E-03', 'F-17', 'G-31'];
const BATCHES = ['Batch 4', 'Batch 7', 'Batch 9', 'Batch 12'];
const PACK_STATIONS = ['Pack 1', 'Pack 2', 'Pack 3', 'Pack 5'];
const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone F'];
const PICKERS = ['Picker 3', 'Picker 8', 'Picker 12', 'Picker 15'];

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

function stamp(t: TelemetrySnapshot): TelemetrySnapshot {
	return { ...t, updatedAt: Date.now() };
}

function prependException(
	exceptions: LiveExceptionRow[],
	row: Omit<LiveExceptionRow, 'id'>
): LiveExceptionRow[] {
	return [
		{
			...row,
			id: `sim-${row.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
		},
		...exceptions
	].slice(0, 12);
}

type SimEvent = (t: TelemetrySnapshot) => TelemetrySnapshot;

/** Large, demo-visible jumps for the executive Big Three + chips. */
const METRIC_EVENTS: SimEvent[] = [
	(t) => {
		const walk = rand(80, 160);
		const laborDelta = rand(140, 280);
		return {
			...t,
			picksCompleted: t.picksCompleted + rand(3, 6),
			laborSavedWeek: t.laborSavedWeek + laborDelta,
			walkDistanceSavedM: t.walkDistanceSavedM + walk,
			picksPerHour: Math.min(120, +(t.picksPerHour + rand(8, 16) / 10).toFixed(1)),
			batchActive: Math.min(18, t.batchActive + (Math.random() < 0.5 ? 1 : 0)),
			liveExceptions: prependException(t.liveExceptions, {
				time: nowTime(),
				type: 'Pick complete',
				entity: pick(BATCHES),
				action: `+$${laborDelta} labor · +${walk}m walk`
			})
		};
	},
	(t) => {
		const dimDelta = rand(60, 140);
		return {
			...t,
			packsCompleted: t.packsCompleted + rand(2, 5),
			dimWasteWeek: Math.max(3_200, t.dimWasteWeek - dimDelta),
			volumeUtilizationPct: Math.min(96, +(t.volumeUtilizationPct + rand(3, 8) / 10).toFixed(1)),
			inventoryAccuracyPct: Math.min(99, +(t.inventoryAccuracyPct + rand(15, 35) / 100).toFixed(2)),
			liveExceptions: prependException(t.liveExceptions, {
				time: nowTime(),
				type: 'Cartonization',
				entity: pick(PACK_STATIONS),
				action: `−$${dimDelta} dim waste`
			})
		};
	},
	(t) => {
		const exposureDelta = rand(-320, 280);
		return {
			...t,
			complianceExposure: Math.max(1_200, t.complianceExposure + exposureDelta),
			complianceYellow: Math.max(2, Math.min(8, t.complianceYellow + rand(-1, 1))),
			complianceGreen: Math.min(48, t.complianceGreen + rand(0, 2)),
			liveExceptions: prependException(t.liveExceptions, {
				time: nowTime(),
				type: 'Compliance pass',
				entity: pick(['PO-8821', 'PO-8834', 'PO-8840']),
				action:
					exposureDelta >= 0
						? `+$${exposureDelta} exposure`
						: `−$${Math.abs(exposureDelta)} exposure`
			})
		};
	},
	(t) => {
		const laborDelta = rand(90, 180);
		return {
			...t,
			picksCompleted: t.picksCompleted + rand(2, 4),
			picksPerHour: Math.min(120, +(t.picksPerHour + rand(6, 12) / 10).toFixed(1)),
			laborSavedWeek: t.laborSavedWeek + laborDelta,
			walkDistanceSavedM: t.walkDistanceSavedM + rand(40, 90),
			liveExceptions: prependException(t.liveExceptions, {
				time: nowTime(),
				type: 'Path optimize',
				entity: pick(ZONES),
				action: `+$${laborDelta} labor saved`
			})
		};
	},
	(t) => {
		const dimDelta = rand(45, 110);
		return {
			...t,
			packsCompleted: t.packsCompleted + rand(1, 3),
			dimWasteWeek: Math.max(3_200, t.dimWasteWeek - dimDelta),
			volumeUtilizationPct: Math.min(96, +(t.volumeUtilizationPct + rand(2, 6) / 10).toFixed(1)),
			liveExceptions: prependException(t.liveExceptions, {
				time: nowTime(),
				type: 'Dim saved',
				entity: pick(PACK_STATIONS),
				action: `−$${dimDelta} billable dim`
			})
		};
	},
	(t) => ({
		...t,
		inventoryAccuracyPct: Math.min(99, +(t.inventoryAccuracyPct + rand(20, 45) / 100).toFixed(2)),
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Cycle count',
			entity: pick(BINS),
			action: 'Variance cleared'
		})
	}),
	(t) => ({
		...t,
		syncQueue: Math.max(2, t.syncQueue - rand(1, 3)),
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Sync',
			entity: pick(ZONES),
			action: 'Queue cleared'
		})
	})
];

const FLOOR_EVENTS: SimEvent[] = [
	(t) => ({
		...t,
		syncQueue: Math.min(22, t.syncQueue + rand(0, 2)),
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
		complianceExposure: Math.max(1_200, t.complianceExposure + rand(-80, 220)),
		complianceYellow: Math.max(2, Math.min(9, t.complianceYellow + rand(0, 1))),
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Override',
			entity: pick([...ZONES, ...PICKERS]),
			action: 'Force-confirm flagged'
		})
	}),
	(t) => ({
		...t,
		batchActive: Math.max(8, t.batchActive + rand(-1, 1)),
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Batch merge',
			entity: pick(BATCHES),
			action: 'Wave consolidated'
		})
	}),
	(t) => ({
		...t,
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Dock scan',
			entity: pick(['Door 3', 'Door 5', 'Door 7']),
			action: 'ASN matched'
		})
	}),
	(t) => ({
		...t,
		liveExceptions: prependException(t.liveExceptions, {
			time: nowTime(),
			type: 'Ship label',
			entity: pick(['PO-8818', 'PO-8826', 'PO-8831']),
			action: 'Validated'
		})
	})
];

/** Metric events dominate so executive numbers move most ticks. */
const EVENT_POOL: SimEvent[] = [
	...METRIC_EVENTS,
	...METRIC_EVENTS,
	...METRIC_EVENTS,
	...FLOOR_EVENTS
];

function applyRandomEvent(t: TelemetrySnapshot): TelemetrySnapshot {
	return stamp(pick(EVENT_POOL)(t));
}

function emitRandomEvent(): void {
	telemetry.update((t) => {
		let next = applyRandomEvent(t);
		if (Math.random() < BURST_CHANCE) {
			next = applyRandomEvent(next);
		}
		return next;
	});
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
