<script lang="ts">
	let {
		values,
		baseline,
		width = 100,
		height = 28,
		stroke = 'var(--green)',
		baselineStroke = 'var(--text-faint)'
	}: {
		values: number[];
		baseline: number;
		width?: number;
		height?: number;
		stroke?: string;
		baselineStroke?: string;
	} = $props();

	const points = $derived.by(() => {
		if (values.length < 2) return '';
		const max = Math.max(...values, baseline, 0.01);
		const min = Math.min(...values, baseline);
		const range = max - min || 1;
		return values
			.map((v, i) => {
				const x = (i / (values.length - 1)) * width;
				const y = height - ((v - min) / range) * (height - 4) - 2;
				return `${x},${y}`;
			})
			.join(' ');
	});

	const baselineY = $derived.by(() => {
		if (values.length < 2) return height / 2;
		const max = Math.max(...values, baseline, 0.01);
		const min = Math.min(...values, baseline);
		const range = max - min || 1;
		return height - ((baseline - min) / range) * (height - 4) - 2;
	});
</script>

<svg class="baseline-spark" {width} {height} viewBox="0 0 {width} {height}" role="img" aria-hidden="true">
	<line
		x1="0"
		y1={baselineY}
		x2={width}
		y2={baselineY}
		stroke={baselineStroke}
		stroke-width="1"
		stroke-dasharray="3 2"
		opacity="0.7"
	/>
	<polyline points={points} fill="none" {stroke} stroke-width="1.5" stroke-linecap="round" />
</svg>

<style>
	.baseline-spark {
		display: block;
		margin-top: 6px;
	}
</style>
