<script lang="ts">
	import { page } from '$app/state';
	import { parseDemoState } from '$lib/demo/parse-state';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import { PICK_REROUTE, PICK_TASK } from '$lib/data/pick';
	import { recordPickComplete } from '$lib/telemetry';

	const demoState = $derived(parseDemoState(page.url.searchParams.get('state')));

	let showException = $state(false);
	let rerouting = $state(false);
	let task = $state({ ...PICK_TASK });

	$effect(() => {
		showException = demoState === 'alert';
	});

	async function reportEmpty() {
		showException = true;
		rerouting = true;
		await new Promise((r) => setTimeout(r, 2000));
		task = {
			...task,
			location: PICK_REROUTE.location,
			batchProgress: { ...task.batchProgress, current: task.batchProgress.current + 1 }
		};
		rerouting = false;
		recordPickComplete();
	}

	function completeScan() {
		recordPickComplete();
		if (task.batchProgress.current < task.batchProgress.total) {
			task = {
				...task,
				batchProgress: {
					...task.batchProgress,
					current: task.batchProgress.current + 1
				}
			};
		}
	}

	const progressPct = $derived(
		(task.batchProgress.current / task.batchProgress.total) * 100
	);
</script>

<ViewportFrame variant="mobile">
	<header class="mobile-header">
		<span class="label">Slide 12 · Pick-path</span>
		<span class="mono batch">Batch 7 · Zone A</span>
	</header>

	<main class="pick">
		{#if demoState === 'loading' || rerouting}
			<div class="reroute">
				<div class="spinner"></div>
				<p class="mono">Rerouting…</p>
			</div>
		{:else}
			<section class="next-pick">
				<p class="label">Next pick</p>
				<p class="location mono">{task.location}</p>
				<p class="sku mono">{task.sku}</p>
				<p class="desc">{task.description}</p>
				<div class="meta">
					<span class="mono">Qty {task.qty}</span>
					<span class="mono">{task.toteSlot}</span>
				</div>

				<div class="progress-ring" aria-label="Batch progress">
					<svg viewBox="0 0 100 100">
						<circle cx="50" cy="50" r="42" class="track" />
						<circle
							cx="50"
							cy="50"
							r="42"
							class="fill"
							stroke-dasharray="{progressPct * 2.64} 264"
						/>
					</svg>
					<div class="progress-label mono">
						{task.batchProgress.current} of {task.batchProgress.total}
						<span>~{task.walkSavedM}m saved</span>
					</div>
				</div>

				<div class="scan-actions">
					<button type="button" class="scan primary" onclick={completeScan}>Scan bin · item · tote</button>
					<button
						type="button"
						class="scan ghost"
						onclick={() => (showException = true)}
					>
						Long-press · report issue
					</button>
				</div>
			</section>
		{/if}

		{#if showException && !rerouting}
			<div class="sheet-backdrop" role="presentation" onclick={() => (showException = false)}></div>
			<aside class="sheet" aria-label="Exception report">
				<p class="section-title">Report exception</p>
				<button type="button" class="sheet-btn" onclick={reportEmpty}>Bin empty</button>
				<button type="button" class="sheet-btn">Damaged</button>
				<button type="button" class="sheet-btn">Wrong item</button>
			</aside>
		{/if}
	</main>
</ViewportFrame>

<style>
	.mobile-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 16px;
		background: var(--surface-panel);
		border-bottom: 1px solid var(--hairline);
	}

	.batch {
		font-size: 10px;
		color: var(--text-muted);
	}

	.pick {
		position: relative;
		min-height: 640px;
		padding: 20px 16px 100px;
		background: var(--surface-base);
	}

	.next-pick {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.location {
		margin: 4px 0 0;
		font-size: 32px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.sku {
		margin: 0;
		font-size: 12px;
		color: var(--text-muted);
	}

	.desc {
		margin: 0;
		font-size: 15px;
		font-weight: 500;
	}

	.meta {
		display: flex;
		gap: 16px;
		margin-top: 8px;
		font-size: 12px;
		color: var(--text-secondary);
	}

	.progress-ring {
		position: relative;
		width: 140px;
		height: 140px;
		margin: 24px auto;
	}

	.progress-ring svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}

	.track {
		fill: none;
		stroke: var(--separator);
		stroke-width: 8;
	}

	.fill {
		fill: none;
		stroke: var(--green);
		stroke-width: 8;
		stroke-linecap: round;
	}

	.progress-label {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: 600;
		text-align: center;
	}

	.progress-label span {
		display: block;
		margin-top: 4px;
		font-size: 10px;
		font-weight: 400;
		color: var(--text-muted);
	}

	.scan-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 24px;
	}

	.scan {
		padding: 14px;
		border-radius: var(--radius-lg);
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.scan.primary {
		border: none;
		background: var(--green);
		color: white;
	}

	.scan.ghost {
		border: 1px solid var(--hairline);
		background: white;
		color: var(--text-secondary);
	}

	.reroute {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-height: 300px;
	}

	.spinner {
		width: 36px;
		height: 36px;
		border: 3px solid var(--separator);
		border-top-color: var(--green);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.sheet-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.35);
	}

	.sheet {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 20px 16px 32px;
		background: var(--surface-panel);
		border-top-left-radius: 16px;
		border-top-right-radius: 16px;
		box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.12);
	}

	.sheet-btn {
		display: block;
		width: 100%;
		margin-top: 10px;
		padding: 14px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: white;
		font-size: 13px;
		font-weight: 600;
		text-align: left;
		cursor: pointer;
	}
</style>
