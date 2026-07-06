<script lang="ts">
	/** Gaussian hotspot heatmap — pattern from 1-plan/archive/claude-design reference */
	let { intensity = 1 }: { intensity?: number } = $props();

	const cols = 18;
	const rows = 7;
	const hotspots = [
		{ x: 4, y: 3, amp: 0.9 },
		{ x: 9, y: 2, amp: 0.75 },
		{ x: 11, y: 5, amp: 0.85 }
	];

	function heat(x: number, y: number, phase: number): number {
		let v = 0;
		for (const h of hotspots) {
			const dx = x - h.x;
			const dy = y - h.y;
			const shimmer = 0.85 + 0.15 * Math.sin(phase * 0.08 + h.x);
			v += h.amp * shimmer * Math.exp(-(dx * dx + dy * dy) / 4.5);
		}
		return Math.min(1, v * intensity);
	}

	let phase = $state(0);

	$effect(() => {
		const id = setInterval(() => {
			phase += 1;
		}, 120);
		return () => clearInterval(id);
	});

	function cellStyle(v: number): string {
		const r = Math.round(160 + v * 40);
		const g = Math.round(160 - v * 130);
		const b = Math.round(120 - v * 100);
		const a = (0.12 + v * 0.85).toFixed(2);
		return `background: rgba(${r}, ${g}, ${b}, ${a})`;
	}
</script>

<div class="heatmap">
	<div class="grid">
		{#each Array(rows) as _, y}
			{#each Array(cols) as _, x}
				{@const v = heat(x, y, phase)}
				<div class="cell" style={cellStyle(v)}></div>
			{/each}
		{/each}
	</div>
	<div class="axis mono">
		<span>AISLE A</span>
		<span>AISLE G</span>
		<span>AISLE N</span>
	</div>
</div>

<style>
	.heatmap {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(18, 1fr);
		gap: 3px;
	}

	.cell {
		height: 15px;
		border-radius: var(--radius-sm);
	}

	.axis {
		display: flex;
		justify-content: space-between;
		font-size: 9px;
		color: var(--text-faint);
		letter-spacing: 0.06em;
	}
</style>
