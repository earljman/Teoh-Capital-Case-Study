<script lang="ts">
	import Sparkline from './Sparkline.svelte';
	import MiniBarChart from './MiniBarChart.svelte';
	import ThresholdGauge from './ThresholdGauge.svelte';
	import BaselineSparkline from './BaselineSparkline.svelte';
	import TrafficTimeline from './TrafficTimeline.svelte';
	import HelpTitle from './HelpTitle.svelte';
	import type { TopMetric } from '$lib/data/executive';
	import type { HelpId } from '$lib/data/help-content';

	const METRIC_HELP: Record<TopMetric['id'], HelpId> = {
		labor: 'labor-saved',
		compliance: 'chargeback-exposure',
		dim: 'dim-waste',
		otif: 'otif-at-risk',
		inventory: 'a-item-accuracy',
		override: 'override-rate'
	};

	let { metric }: { metric: TopMetric } = $props();

	const stroke = $derived(
		metric.tone === 'critical'
			? 'var(--red)'
			: metric.tone === 'warn'
				? 'var(--amber)'
				: metric.tone === 'good'
					? 'var(--green)'
					: 'var(--text-muted)'
	);
</script>

<div
	class="metric-chip"
	class:good={metric.tone === 'good'}
	class:warn={metric.tone === 'warn'}
	class:critical={metric.tone === 'critical'}
>
	<p class="chip-label">
		<HelpTitle helpId={METRIC_HELP[metric.id]} title={metric.label} variant="chip-label" />
	</p>
	<p class="chip-value mono">{metric.value}</p>

	{#if metric.viz.kind === 'sparkline'}
		<Sparkline values={metric.viz.values} width={100} height={24} {stroke} />
	{:else if metric.viz.kind === 'bars'}
		<MiniBarChart values={metric.viz.values} width={100} height={24} fill={stroke} warnFrom={metric.viz.warnFrom} />
	{:else if metric.viz.kind === 'gauge'}
		<ThresholdGauge value={metric.viz.value} threshold={metric.viz.threshold ?? 90} />
	{:else if metric.viz.kind === 'baseline'}
		<BaselineSparkline values={metric.viz.values} baseline={metric.viz.baseline} width={100} height={24} {stroke} />
	{:else if metric.viz.kind === 'timeline'}
		<TrafficTimeline days={metric.viz.days} />
	{/if}
</div>

<style>
	.metric-chip {
		border: 1px solid var(--separator);
		border-radius: var(--radius-md);
		background: white;
		padding: 8px 10px;
		min-height: 72px;
	}

	.metric-chip.good {
		border-color: color-mix(in oklab, var(--green) 35%, white);
	}

	.metric-chip.warn {
		border-color: color-mix(in oklab, var(--amber) 35%, white);
	}

	.metric-chip.critical {
		border-color: color-mix(in oklab, var(--red) 40%, white);
		background: color-mix(in oklab, var(--red) 5%, white);
	}

	.chip-label {
		margin: 0;
		font-size: 10px;
		color: var(--text-muted);
	}

	.chip-value {
		margin: 4px 0 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}
</style>
