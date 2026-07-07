<script lang="ts">
	let {
		buckets,
		width = 120,
		height = 32
	}: {
		buckets: { label: string; count: number; tone?: 'neutral' | 'warn' | 'critical' }[];
		width?: number;
		height?: number;
	} = $props();

	const max = $derived(Math.max(...buckets.map((b) => b.count), 1));
	const barWidth = $derived(buckets.length ? (width - (buckets.length - 1) * 4) / buckets.length : 0);

	const fills = {
		neutral: 'var(--green)',
		warn: 'var(--amber)',
		critical: 'var(--red)'
	} as const;
</script>

<svg class="aging-hist" {width} {height} viewBox="0 0 {width} {height}" role="img" aria-hidden="true">
	{#each buckets as bucket, i}
		{@const h = (bucket.count / max) * (height - 10)}
		{@const x = i * (barWidth + 4)}
		{@const y = height - h - 8}
		<rect {x} {y} width={barWidth} height={h} rx="1" fill={fills[bucket.tone ?? 'neutral']} opacity="0.85" />
		<text x={x + barWidth / 2} y={height - 1} text-anchor="middle" class="label">{bucket.label}</text>
	{/each}
</svg>

<style>
	.aging-hist {
		display: block;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 6px;
		fill: var(--text-faint);
	}
</style>
