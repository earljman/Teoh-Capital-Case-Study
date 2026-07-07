<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { parseDemoState } from '$lib/demo/parse-state';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import DashboardChrome from '$lib/components/DashboardChrome.svelte';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import { SUPERVISOR_ALERT, SUPERVISOR_HAPPY } from '$lib/data/supervisor';

	const demoState = $derived(parseDemoState(page.url.searchParams.get('state')));
	const loading = $derived(demoState === 'loading');
	const data = $derived(demoState === 'alert' ? SUPERVISOR_ALERT : SUPERVISOR_HAPPY);
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
				{:else if data.allClear}
					<p class="queue-title">All clear — 0 items need attention</p>
					<p class="queue-sub mono">Floor ops nominal · last scan 12s ago</p>
				{:else}
					<p class="queue-title alert-text">
						⚠ {data.actionQueue.map((i) => `${i.count} ${i.label.toLowerCase()}`).join(' · ')}
					</p>
					<button type="button" class="triage mono">Triage all →</button>
				{/if}
			</section>

			<section class="floor-ops">
				<div class="widget">
					<h2 class="section-title">Dynamic batch</h2>
					{#if loading}
						<div class="skeleton w-skel"></div>
					{:else}
						<p class="stat mono">{data.batch.active} active · {data.batch.clusters} clusters</p>
						<p class="sub mono">{data.batch.walkKmSaved}km saved · shift</p>
						<a class="link mono" href={resolve('/pick')}>Override batch</a>
					{/if}
				</div>
				<div class="widget">
					<h2 class="section-title">Cartonization efficiency</h2>
					{#if loading}
						<div class="skeleton w-skel"></div>
					{:else}
						<p class="stat mono">{data.cartonization.utilizationPct}% avg volume utilization</p>
						<a class="link mono" href={resolve('/pack')}>See pack station →</a>
					{/if}
				</div>
				<div class="widget heatmap-widget">
					<h2 class="section-title">Aisle congestion heatmap</h2>
					{#if loading}
						<div class="skeleton h-skel"></div>
					{:else}
						<Heatmap />
						<p class="sub mono">
							{data.heatmapHotZone} bottleneck · {data.heatmapPickers} pickers
							<a class="link" href={resolve('/pick')}>View zone →</a>
						</p>
					{/if}
				</div>
			</section>

			<section class="exception-log">
				<div class="log-head">
					<h2 class="section-title">Exception log</h2>
					{#if !loading && data.unresolvedAgingCount > 0}
						<span class="aging-chip mono">{data.unresolvedAgingCount} unresolved &gt;30m</span>
					{/if}
				</div>
				{#each data.exceptions as row (`${row.time}-${row.type}-${row.entity}`)}
					<div class="ex-row">
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
				<h2 class="section-title">Friction watch</h2>
				<div class="friction-grid">
					<div class="mini-card">
						<span class="label">Sync queue</span>
						<span
							class="value mono"
							class:warn={data.friction.syncQueue > 10}
							class:crit={data.friction.syncQueue > 25}
						>
							{data.friction.syncQueue}
						</span>
						<span class="meta mono">Oldest event {data.friction.oldestUnsyncedMinutes}m</span>
					</div>
					<div class="mini-card">
						<span class="label">Override rate</span>
						<span class="value mono" class:warn={data.friction.overrideRatePct > 5}>
							{data.friction.overrideRatePct}%
						</span>
						<span class="meta mono">
							{data.friction.overrideApprovedPct}% approved · {data.friction.overrideFlaggedPct}% flagged
						</span>
					</div>
					<div class="mini-card">
						<span class="label">Hygiene gate</span>
						<span class="value mono">{data.friction.hygienePct}%</span>
					</div>
					<div class="mini-card">
						<span class="label">A-item accuracy</span>
						<span class="value mono" class:warn={data.friction.inventoryAccuracyPct < 90}>
							{data.friction.inventoryAccuracyPct}%
						</span>
					</div>
				</div>
				<div class="deferred mono">
					<p class="deferred-title">Phase 1.5 signals</p>
					<p>Dock-to-stock avg: {data.deferredMetrics.dockToStockHoursAvg}h</p>
					<p>Phantom risk: {data.deferredMetrics.phantomRiskPct}%</p>
				</div>
			</section>

			<section class="ai-log dark-panel">
				<h2 class="section-title light">AI engine log</h2>
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
		grid-template-columns: 1fr 280px;
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

	.stat {
		margin: 8px 0 4px;
		font-size: 18px;
		font-weight: 500;
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

	.log-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
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
		height: 120px;
	}
</style>
