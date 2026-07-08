import type { ExecutiveDashboardData } from '$lib/data/executive';
import type { ExceptionRow, SupervisorDashboardData } from '$lib/data/supervisor';
import { DEFAULT_TELEMETRY, type TelemetrySnapshot } from '$lib/telemetry';

const usd = (n: number, maxFrac = 0) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: maxFrac
	}).format(n);

const usdK = (n: number) => {
	if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
	return usd(n);
};

export function applyTelemetryToExecutive(
	base: ExecutiveDashboardData,
	t: TelemetrySnapshot
): ExecutiveDashboardData {
	const laborPrimary = usd(t.laborSavedWeek);
	const dimPrimary = usd(t.dimWasteWeek);
	const picksHr = Math.round(t.picksPerHour);

	return {
		...base,
		cards: base.cards.map((card) => {
			if (card.muted) return card;
			switch (card.id) {
				case 'labor':
					return {
						...card,
						primary: `${laborPrimary} this wk`,
						secondary: `${picksHr} picks/hr · ↑18% vs baseline`
					};
				case 'dim':
					return {
						...card,
						primary: `${dimPrimary} lost/wk`
					};
				case 'compliance':
					return {
						...card,
						secondary: `~${usdK(t.complianceExposure)} exposure`
					};
				default:
					return card;
			}
		}),
		topMetrics: base.topMetrics.map((metric) => {
			switch (metric.id) {
				case 'labor':
					return { ...metric, value: `${usdK(t.laborSavedWeek)}/wk` };
				case 'dim':
					return metric.value === 'Gated'
						? metric
						: { ...metric, value: `${usdK(t.dimWasteWeek)}/wk` };
				case 'compliance':
					return { ...metric, value: usdK(t.complianceExposure) };
				case 'inventory':
					return metric.viz.kind === 'gauge'
						? {
								...metric,
								value: `${Math.round(t.inventoryAccuracyPct)}%`,
								viz: { ...metric.viz, value: t.inventoryAccuracyPct }
							}
						: metric;
				default:
					return metric;
			}
		}),
		annualMarginProtected:
			base.annualMarginProtected + t.picksCompleted * 120 + t.packsCompleted * 85
	};
}

export function applyTelemetryToSupervisor(
	base: SupervisorDashboardData,
	t: TelemetrySnapshot
): SupervisorDashboardData {
	const liveRows: ExceptionRow[] = t.liveExceptions.map((row) => ({
		time: row.time,
		type: row.type,
		entity: row.entity,
		action: row.action
	}));

	return {
		...base,
		batch: {
			...base.batch,
			walkKmSaved:
				Math.round(
					(base.batch.walkKmSaved +
						(t.walkDistanceSavedM - DEFAULT_TELEMETRY.walkDistanceSavedM) / 1000) *
						10
				) / 10
		},
		cartonization: {
			...base.cartonization,
			utilizationPct: Math.round(t.volumeUtilizationPct * 10) / 10
		},
		friction: {
			...base.friction,
			inventoryAccuracyPct: Math.round(t.inventoryAccuracyPct * 10) / 10
		},
		exceptions: [...liveRows, ...base.exceptions]
	};
}
