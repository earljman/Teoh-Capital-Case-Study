<script lang="ts">
	let {
		values,
		width = 100,
		height = 28,
		fill = 'var(--green)',
		warnFrom
	}: {
		values: number[];
		width?: number;
		height?: number;
		fill?: string;
		warnFrom?: number;
	} = $props();

	const barWidth = $derived(values.length ? (width - (values.length - 1) * 2) / values.length : 0);
	const max = $derived(Math.max(...values, 1));
</script>

<svg class="mini-bars" {width} {height} viewBox="0 0 {width} {height}" role="img" aria-hidden="true">
	{#each values as v, i}
		{@const h = (v / max) * (height - 2)}
		{@const x = i * (barWidth + 2)}
		{@const y = height - h}
		<rect
			{x}
			{y}
			width={barWidth}
			height={h}
			rx="1"
			fill={warnFrom !== undefined && v >= warnFrom ? 'var(--amber)' : fill}
		/>
	{/each}
</svg>

<style>
	.mini-bars {
		display: block;
		margin-top: 6px;
	}
</style>
