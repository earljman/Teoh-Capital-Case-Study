<script lang="ts">
	let {
		values,
		width = 120,
		height = 32,
		stroke = 'var(--green)',
		fill = 'rgba(31, 122, 77, 0.12)'
	}: {
		values: number[];
		width?: number;
		height?: number;
		stroke?: string;
		fill?: string;
	} = $props();

	const points = $derived.by(() => {
		if (values.length < 2) return '';
		const max = Math.max(...values, 0.01);
		const min = Math.min(...values);
		const range = max - min || 1;
		return values
			.map((v, i) => {
				const x = (i / (values.length - 1)) * width;
				const y = height - ((v - min) / range) * (height - 4) - 2;
				return `${x},${y}`;
			})
			.join(' ');
	});

	const areaPoints = $derived(`${points} ${width},${height} 0,${height}`);
</script>

<svg
	class="sparkline"
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	role="img"
	aria-hidden="true"
>
	<polygon points={areaPoints} {fill} />
	<polyline points={points} fill="none" {stroke} stroke-width="1.5" stroke-linecap="round" />
</svg>

<style>
	.sparkline {
		display: block;
	}
</style>
