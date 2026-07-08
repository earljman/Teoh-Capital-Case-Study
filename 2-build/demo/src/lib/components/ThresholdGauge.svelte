<script lang="ts">
	let {
		value,
		threshold = 90,
		width = 100
	}: {
		value: number;
		threshold?: number;
		width?: number;
	} = $props();

	const fillPct = $derived(Math.min(100, Math.max(0, value)));
	const fillColor = $derived(
		value < threshold ? 'var(--amber)' : value < threshold + 3 ? 'var(--green)' : 'var(--green)'
	);
</script>

<div class="gauge" style:width="{width}px" role="img" aria-label="Gauge at {value}% with {threshold}% threshold">
	<div class="track">
		<div class="fill" style:width="{fillPct}%" style:background={fillColor}></div>
		<div class="threshold" style:left="{threshold}%"></div>
	</div>
	<span class="threshold-label mono">{threshold}% gate</span>
</div>

<style>
	.gauge {
		margin-top: 6px;
	}

	.track {
		position: relative;
		height: 6px;
		border-radius: 999px;
		background: var(--separator);
		overflow: visible;
	}

	.fill {
		height: 100%;
		border-radius: 999px;
		transition:
			width 0.45s ease,
			background 0.3s ease;
	}

	.threshold {
		position: absolute;
		top: -2px;
		width: 2px;
		height: 10px;
		background: var(--text-faint);
		transform: translateX(-50%);
	}

	.threshold-label {
		display: block;
		margin-top: 3px;
		font-size: 8px;
		color: var(--text-faint);
	}
</style>
