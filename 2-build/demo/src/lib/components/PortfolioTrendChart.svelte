<script lang="ts">
	let {
		weeks,
		labor,
		compliance,
		dim,
		width = 560,
		height = 100
	}: {
		weeks: string[];
		labor: number[];
		compliance: number[];
		dim: number[];
		width?: number;
		height?: number;
	} = $props();

	const series = $derived([
		{ key: 'labor', values: labor, color: 'var(--green)', label: 'Labor saved' },
		{ key: 'compliance', values: compliance, color: 'var(--amber)', label: 'Compliance avoided' },
		{ key: 'dim', values: dim, color: '#5a8f6e', label: 'DIM recovered' }
	]);

	const max = $derived(
		Math.max(...labor, ...compliance, ...dim, 1)
	);

	const groupWidth = $derived(weeks.length ? width / weeks.length : 0);
	const barWidth = 5;
	const gap = 2;
</script>

<div class="portfolio" role="img" aria-label="8-week portfolio trend">
	<svg {width} {height} viewBox="0 0 {width} {height}">
		{#each weeks as week, wi}
			{@const gx = wi * groupWidth + groupWidth / 2}
			{#each series as s, si}
				{@const v = s.values[wi]}
				{@const h = (v / max) * (height - 22)}
				{@const x = gx - (barWidth * 3 + gap * 2) / 2 + si * (barWidth + gap)}
				{@const y = height - 14 - h}
				<rect {x} {y} width={barWidth} height={h} rx="1" fill={s.color} opacity="0.9" />
			{/each}
			<text x={gx} y={height - 2} text-anchor="middle" class="week-label">{week}</text>
		{/each}
	</svg>
	<div class="legend mono">
		{#each series as s}
			<span><i style:background={s.color}></i>{s.label}</span>
		{/each}
	</div>
</div>

<style>
	.portfolio {
		margin-top: 8px;
	}

	.week-label {
		font-family: var(--font-mono);
		font-size: 8px;
		fill: var(--text-faint);
	}

	.legend {
		display: flex;
		gap: 14px;
		margin-top: 6px;
		font-size: 9px;
		color: var(--text-muted);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.legend i {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 1px;
		font-style: normal;
	}
</style>
