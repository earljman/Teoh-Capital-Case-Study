<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { parseDemoState } from '$lib/demo/parse-state';
	import { isScreenshotMode } from '$lib/demo/href';
	import { applyTelemetryToSupervisor } from '$lib/demo/apply-telemetry';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import DashboardChrome from '$lib/components/DashboardChrome.svelte';
	import WarehouseFloorMap from '$lib/components/WarehouseFloorMap.svelte';
	import MiniBarChart from '$lib/components/MiniBarChart.svelte';
	import StackedHorizontalBar from '$lib/components/StackedHorizontalBar.svelte';
	import BaselineSparkline from '$lib/components/BaselineSparkline.svelte';
	import ThresholdGauge from '$lib/components/ThresholdGauge.svelte';
	import AgingHistogram from '$lib/components/AgingHistogram.svelte';
	import Sparkline from '$lib/components/Sparkline.svelte';
	import HelpTitle from '$lib/components/HelpTitle.svelte';
	import { SUPERVISOR_ALERT, SUPERVISOR_HAPPY } from '$lib/data/supervisor';
	import { DEFAULT_TELEMETRY, telemetry, type TelemetrySnapshot } from '$lib/telemetry';

	const demoState = $derived(parseDemoState(page.url.searchParams.get('state')));
	const screenshot = $derived(isScreenshotMode(page.url.searchParams));
	const liveTelemetry = $derived(!screenshot && demoState !== 'loading');
	const loading = $derived(demoState === 'loading');

	const baseData = $derived(demoState === 'alert' ? SUPERVISOR_ALERT : SUPERVISOR_HAPPY);

	let tel = $state<TelemetrySnapshot>({ ...DEFAULT_TELEMETRY });
	let liveExceptionIds = $state<Set<string>>(new Set());
	let telemetryReady = false;

	$effect(() => {
		if (!liveTelemetry) {
			tel = { ...DEFAULT_TELEMETRY };
			liveExceptionIds = new Set();
			telemetryReady = false;
			return;
		}

		const unsub = telemetry.subscribe((value) => {
			if (!telemetryReady) {
				tel = value;
				telemetryReady = true;
				return;
			}

			const prevIds = new Set(tel.liveExceptions.map((row) => row.id));
			tel = value;
			const nextIds = value.liveExceptions
				.filter((row) => !prevIds.has(row.id))
				.map((row) => row.id);
			if (nextIds.length > 0) {
				liveExceptionIds = new Set([...liveExceptionIds, ...nextIds]);
			}
		});
		return () => {
			unsub();
			telemetryReady = false;
		};
	});

	const data = $derived(
		liveTelemetry ? applyTelemetryToSupervisor(baseData, tel) : baseData
	);

	let floorLayer = $state<'congestion' | 'stock'>('congestion');

	function exceptionKey(row: { time: string; type: string; entity: string }) {
		return `${row.time}-${row.type}-${row.entity}`;
	}

	function isLiveException(row: { time: string; type: string; entity: string }) {
		return tel.liveExceptions.some(
			(live) =>
				live.time === row.time &&
				live.type === row.type &&
				live.entity === row.entity &&
				liveExceptionIds.has(live.id)
		);
	}
</script>

<ViewportFrame>
	<DashboardChrome
		siteLabel={data.siteLabel}
		periodLabel="Today"
		lastRefreshed={data.lastRefreshed}
		shiftLabel={data.shiftLabel}
	/>

	<main class="supervisor">
		<div class="main-col">
			<section class="action-queue" class:alert={!data.allClear}>
				{#if loading}
					<div class="skeleton queue-skel"></div>
				{:else}
					<div class="queue-body">
						<HelpTitle helpId="action-queue" title="Action queue" variant="label" />
						{#if data.allClear}
							<p class="queue-title">All clear — 0 items need attention</p>
							<p class="queue-sub mono">Floor ops nominal · last scan 12s ago</p>
						{:else}
							<p class="queue-title alert-text">
								⚠ {data.actionQueue.map((i) => `${i.count} ${i.label.toLowerCase()}`).join(' · ')}
							</p>
						{/if}
					</div>
					{#if !data.allClear}
						<button type="button" class="triage mono">Triage all →</button>
					{/if}
				{/if}
			</section>

			<section class="floor-ops">
				<div class="widget">
					<h2 class="section-title">
						<HelpTitle helpId="dynamic-batch" title="Dynamic batch" variant="section-title" as="span" />
					</h2>
					{#if loading}
						<div class="skeleton w-skel"></div>
					{:else}
						<p class="stat mono">{data.batch.active} active · {data.batch.clusters} clusters</p>
						<p class="sub mono">{data.batch.walkKmSaved}km saved · shift</p>
						<a class="link mono" href={resolve('/pick')}>Override batch</a>
					{/if}
				</div>
				<div class="widget">
					<h2 class="section-title">
						<HelpTitle
							helpId="cartonization-efficiency"
							title="Cartonization efficiency"
							variant="section-title"
							as="span"
						/>
					</h2>
					{#if loading}
						<div class="skeleton w-skel"></div>
					{:else}
						<p class="stat mono">{data.cartonization.utilizationPct}% avg volume utilization</p>
						<a class="link mono" href={resolve('/pack')}>See pack station →</a>
					{/if}
				</div>
				<div class="widget heatmap-widget">
					<div class="heatmap-head">
						<h2 class="section-title">
							<HelpTitle
								helpId="aisle-congestion-heatmap"
								title="Aisle congestion heatmap"
								variant="section-title"
								as="span"
							/>
						</h2>
						{#if !loading}
							<div class="layer-toggle mono" role="group" aria-label="Floor map layer">
								<button
									type="button"
									class:active={floorLayer === 'congestion'}
									onclick={() => (floorLayer = 'congestion')}
								>
									Congestion
								</button>
								<button
									type="button"
									class:active={floorLayer === 'stock'}
									onclick={() => (floorLayer = 'stock')}
								>
									Stock
								</button>
							</div>
						{/if}
					</div>
					{#if loading}
						<div class="skeleton h-skel"></div>
					{:else}
						<WarehouseFloorMap floor={data.floorMap} layer={floorLayer} />
						<p class="sub mono">
							{data.heatmapHotZone} bottleneck · {data.heatmapPickers} pickers
							<a class="link" href={resolve('/pick')}>View zone →</a>
						</p>
					{/if}
				</div>
			</section>

			<section class="exception-log">
				{#if !loading}
					<div class="aging-viz">
						<div class="aging-head">
							<p class="viz-label mono">
								<HelpTitle helpId="exception-aging" title="Exception aging" variant="label" />
							</p>
							{#if data.unresolvedAgingCount > 0}
								<span class="aging-chip mono">{data.unresolvedAgingCount} unresolved &gt;30m</span>
							{/if}
						</div>
						<AgingHistogram buckets={data.exceptionAgingBuckets} width={280} height={36} />
					</div>
				{/if}
				<h2 class="section-title log-title">
					<HelpTitle helpId="exception-log" title="Exception log" variant="section-title" as="span" />
				</h2>
				{#each data.exceptions as row (exceptionKey(row))}
					<div class="ex-row" class:motion-rowin={isLiveException(row)}>
						<span class="time mono">{row.time}</span>
						<span class="type">{row.type}</span>
						<span class="entity mono">{row.entity}</span>
						<span class="action mono">{row.action}</span>
					</div>
				{/each}
			</section>
		</div>

		<aside class="rail">
			<section class="friction">
				<h2 class="section-title">
					<HelpTitle helpId="friction-watch" title="Friction watch" variant="section-title" as="span" />
				</h2>
				<div class="friction-grid">
					<div class="mini-card">
						<span class="label">
							<HelpTitle helpId="sync-queue" title="Sync queue" variant="label" />
						</span>
						<span
							class="value mono"
							class:warn={data.friction.syncQueue > 10}
							class:crit={data.friction.syncQueue > 25}
						>
							{data.friction.syncQueue}
						</span>
						<span class="meta mono">Oldest event {data.friction.oldestUnsyncedMinutes}m</span>
						{#if !loading}
							<MiniBarChart
								values={data.friction.syncQueueHourly}
								width={108}
								height={22}
								fill="var(--green)"
								warnFrom={10}
							/>
						{/if}
					</div>
					<div class="mini-card span-2">
						<span class="label">
							<HelpTitle helpId="override-rate" title="Override rate" variant="label" />
						</span>
						<span class="value mono" class:warn={data.friction.overrideRatePct > 5}>
							{data.friction.overrideRatePct}%
						</span>
						{#if !loading}
							<StackedHorizontalBar
								segments={[
									{
										value: data.friction.overrideApprovedPct,
										color: 'var(--green)',
										label: `${data.friction.overrideApprovedPct}% ok`
									},
									{
										value: data.friction.overrideFlaggedPct,
										color: 'var(--amber)',
										label: `${data.friction.overrideFlaggedPct}% flagged`
									}
								]}
							/>
							<BaselineSparkline
								values={data.friction.overrideTrend}
								baseline={data.friction.overrideBaselinePct / 100}
								width={108}
								height={22}
								stroke={data.friction.overrideRatePct > 5 ? 'var(--amber)' : 'var(--green)'}
							/>
						{/if}
					</div>
					<div class="mini-card">
						<span class="label">
							<HelpTitle helpId="hygiene-gate" title="Hygiene gate" variant="label" />
						</span>
						<span class="value mono">{data.friction.hygienePct}%</span>
					</div>
					<div class="mini-card">
						<span class="label">
							<HelpTitle helpId="a-item-accuracy" title="A-item accuracy" variant="label" />
						</span>
						<span class="value mono" class:warn={data.friction.inventoryAccuracyPct < 90}>
							{data.friction.inventoryAccuracyPct}%
						</span>
						{#if !loading}
							<ThresholdGauge
								value={data.friction.inventoryAccuracyPct}
								threshold={90}
								width={108}
							/>
						{/if}
					</div>
				</div>
				<div class="deferred mono">
					<p class="deferred-title">
						<HelpTitle helpId="phase-1-5-signals" title="Phase 1.5 signals" variant="label" />
					</p>
					<div class="deferred-row">
						<span>Dock-to-stock avg: {data.deferredMetrics.dockToStockHoursAvg}h</span>
						{#if !loading}
							<Sparkline
								values={data.deferredMetrics.dockToStockTrend.map((h) => h / 20)}
								width={72}
								height={18}
								stroke="var(--amber)"
							/>
						{/if}
					</div>
					<div class="deferred-row">
						<span>Phantom risk: {data.deferredMetrics.phantomRiskPct}%</span>
						{#if !loading}
							<Sparkline
								values={data.deferredMetrics.phantomRiskTrend.map((p) => p / 6)}
								width={72}
								height={18}
								stroke="var(--red)"
							/>
						{/if}
					</div>
				</div>
			</section>

			<section class="ai-log dark-panel">
				<h2 class="section-title light">
					<HelpTitle
						helpId="ai-engine-log"
						title="AI engine log"
						variant="section-title"
						as="span"
						light
					/>
				</h2>
				{#each data.aiLog as entry (`${entry.time}-${entry.kind}`)}
					<div class="log-row">
						<span class="time mono">{entry.time}</span>
						<span class="kind mono">{entry.kind}</span>
						<span class="msg mono">{entry.message}</span>
					</div>
				{/each}
			</section>
		</aside>
	</main>
</ViewportFrame>

<style>
	.supervisor {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 1px;
		background: var(--hairline);
		min-height: calc(900px - 52px);
	}

	.main-col,
	.rail {
		background: var(--surface-base);
	}

	.main-col {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.action-queue {
		padding: 16px 20px;
		background: var(--surface-panel);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.action-queue.alert {
		border-left: 3px solid var(--red);
	}

	.queue-body {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.queue-title {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
	}

	.queue-title.alert-text {
		color: var(--red);
	}

	.queue-sub {
		margin: 4px 0 0;
		font-size: 10px;
		color: var(--green);
	}

	.triage {
		padding: 8px 14px;
		border: 1px solid var(--green-outline);
		background: var(--green-tint);
		color: var(--green);
		border-radius: var(--radius-lg);
		font-size: 10px;
		font-weight: 600;
		cursor: pointer;
	}

	.floor-ops {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		background: var(--hairline);
	}

	.widget {
		padding: 16px 18px;
		background: var(--surface-panel);
	}

	.heatmap-widget {
		grid-column: 1 / -1;
	}

	.heatmap-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
	}

	.heatmap-head .section-title {
		margin: 0;
	}

	.layer-toggle {
		display: inline-flex;
		border: 1px solid var(--separator);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.layer-toggle button {
		padding: 4px 10px;
		border: none;
		background: white;
		color: var(--text-muted);
		font-size: 9px;
		font-weight: 600;
		cursor: pointer;
	}

	.layer-toggle button + button {
		border-left: 1px solid var(--separator);
	}

	.layer-toggle button.active {
		background: var(--green-tint);
		color: var(--green);
	}

	.stat {
		margin: 8px 0 4px;
		font-size: 18px;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.sub {
		margin: 0;
		font-size: 10px;
		color: var(--text-muted);
	}

	.link {
		display: inline-block;
		margin-top: 10px;
		font-size: 10px;
		color: var(--green);
	}

	.exception-log {
		flex: 1;
		padding: 16px 18px;
		background: var(--surface-panel);
		overflow: auto;
	}

	.aging-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 4px;
	}

	.log-title {
		margin: 0 0 8px;
	}

	.aging-chip {
		padding: 3px 8px;
		border-radius: 999px;
		border: 1px solid color-mix(in oklab, var(--red) 24%, white);
		background: color-mix(in oklab, var(--red) 9%, white);
		color: var(--red);
		font-size: 10px;
		font-weight: 600;
	}

	.ex-row {
		display: grid;
		grid-template-columns: 48px 100px 80px 1fr;
		gap: 8px;
		padding: 8px 0;
		border-bottom: 1px solid var(--separator);
		font-size: 11px;
	}

	.time {
		color: var(--text-faint);
	}

	.type {
		font-weight: 600;
	}

	.rail {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: var(--hairline);
	}

	.friction {
		padding: 16px;
		background: var(--surface-panel);
	}

	.friction-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-top: 10px;
	}

	.mini-card {
		padding: 10px;
		border: 1px solid var(--separator);
		background: white;
		border-radius: var(--radius-md);
	}

	.mini-card .value {
		display: block;
		margin-top: 4px;
		font-size: 17px;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.mini-card .value.warn {
		color: var(--amber);
	}

	.mini-card .value.crit {
		color: var(--red);
	}

	.mini-card .meta {
		display: block;
		margin-top: 3px;
		font-size: 9px;
		color: var(--text-faint);
	}

	.mini-card.span-2 {
		grid-column: 1 / -1;
	}

	.deferred {
		margin-top: 10px;
		padding-top: 10px;
		border-top: 1px dashed var(--separator);
		font-size: 9px;
		color: var(--text-faint);
	}

	.deferred-title {
		margin: 0 0 4px;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--text-muted);
	}

	.aging-viz {
		margin: 0 0 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--separator);
	}

	.viz-label {
		margin: 0;
		font-size: 9px;
		color: var(--text-faint);
	}

	.deferred-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		margin-bottom: 4px;
	}

	.deferred p {
		margin: 0 0 2px;
	}

	.dark-panel {
		flex: 1;
		padding: 14px 16px;
		background: var(--panel-dark);
		color: var(--panel-dark-body);
		overflow: auto;
	}

	.dark-panel .section-title.light {
		color: var(--panel-dark-heading);
	}

	.log-row {
		display: grid;
		grid-template-columns: 40px 44px 1fr;
		gap: 8px;
		padding: 8px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		font-size: 10px;
	}

	.kind {
		color: var(--panel-dark-green);
		font-weight: 600;
	}

	.queue-skel,
	.w-skel {
		height: 40px;
		width: 80%;
	}

	.h-skel {
		height: 220px;
	}
</style>
