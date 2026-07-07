<script lang="ts">
	let {
		days
	}: {
		days: ('good' | 'warn' | 'critical')[];
	} = $props();

	const colors = {
		good: 'var(--green)',
		warn: 'var(--amber)',
		critical: 'var(--red)'
	} as const;
</script>

<div class="timeline" role="img" aria-label="Daily OTIF risk timeline">
	{#each days as status, i}
		<div class="day">
			<span class="dot" style:background={colors[status]}></span>
			{#if i === 0 || i === days.length - 1}
				<span class="label mono">{i === 0 ? 'Mon' : 'Sun'}</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.timeline {
		display: flex;
		align-items: flex-start;
		gap: 4px;
		margin-top: 6px;
	}

	.day {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		flex: 1;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.label {
		font-size: 7px;
		color: var(--text-faint);
	}
</style>
