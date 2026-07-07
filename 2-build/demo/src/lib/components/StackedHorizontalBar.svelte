<script lang="ts">
	let {
		segments
	}: {
		segments: { value: number; color: string; label: string }[];
	} = $props();

	const total = $derived(segments.reduce((sum, s) => sum + s.value, 0) || 1);
</script>

<div class="stacked" role="img" aria-label="Stacked breakdown">
	<div class="bar">
		{#each segments as segment}
			<div
				class="segment"
				style:width="{(segment.value / total) * 100}%"
				style:background={segment.color}
				title="{segment.label}: {segment.value}%"
			></div>
		{/each}
	</div>
	<div class="legend mono">
		{#each segments as segment}
			<span><i style:background={segment.color}></i>{segment.label}</span>
		{/each}
	</div>
</div>

<style>
	.stacked {
		margin-top: 6px;
	}

	.bar {
		display: flex;
		height: 6px;
		border-radius: 999px;
		overflow: hidden;
		background: var(--separator);
	}

	.legend {
		display: flex;
		gap: 8px;
		margin-top: 4px;
		font-size: 8px;
		color: var(--text-faint);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 3px;
	}

	.legend i {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 1px;
		font-style: normal;
	}
</style>
