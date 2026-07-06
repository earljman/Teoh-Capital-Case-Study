<script lang="ts">
	import { page } from '$app/state';
	import { parseDemoState } from '$lib/demo/parse-state';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import { OVERRIDE_REASONS, PACK_DIRECTIVE } from '$lib/data/pack';
	import { recordPackComplete } from '$lib/telemetry';

	const demoState = $derived(parseDemoState(page.url.searchParams.get('state')));

	let showOverride = $state(false);
	let overrideReason = $state<string>(OVERRIDE_REASONS[0]);
	let confirmed = $state(false);

	$effect(() => {
		showOverride = demoState === 'alert' || demoState === 'gated';
	});

	function confirmPack() {
		confirmed = true;
		recordPackComplete();
	}
</script>

<ViewportFrame>
	<header class="workflow-header">
		<div>
			<p class="label">Slide 13 · Cartonization</p>
			<h1>Pack station · single authoritative box</h1>
		</div>
		<p class="order mono">Order {PACK_DIRECTIVE.orderId}</p>
	</header>

	<main class="pack">
		<section class="directive">
			{#if demoState === 'loading'}
				<div class="skeleton d-skel"></div>
			{:else if demoState === 'gated'}
				<div class="block">
					<h2>Pack blocked</h2>
					<p class="mono">SKU-99201 missing dimensions — capture at receiving</p>
				</div>
			{:else}
				<p class="use-label section-title">Use carton</p>
				<p class="carton mono">{PACK_DIRECTIVE.carton} — {PACK_DIRECTIVE.dimensions}</p>
				<p class="billable mono">Est. billable: {PACK_DIRECTIVE.billableWeight}</p>

				<div class="diagram" aria-hidden="true">
					<div class="box-iso">
						<div class="face top"></div>
						<div class="face front"></div>
						<div class="face side"></div>
					</div>
					<ul class="items">
						{#each PACK_DIRECTIVE.items as item}
							<li class="mono">{item.qty}× {item.sku}</li>
						{/each}
					</ul>
				</div>

				{#if confirmed}
					<p class="confirmed mono">Packed · DIM weight verified</p>
				{:else}
					<button type="button" class="confirm" onclick={confirmPack}>Confirm pack</button>
				{/if}
			{/if}
		</section>

		<aside class="override-panel">
			<p class="section-title">Override</p>
			<label class="mono" for="reason">Reason code (required)</label>
			<select id="reason" bind:value={overrideReason}>
				{#each OVERRIDE_REASONS as reason}
					<option value={reason}>{reason}</option>
				{/each}
			</select>
			{#if showOverride}
				<p class="note mono">Override feeds hygiene alerts on supervisor console</p>
			{/if}
		</aside>
	</main>
</ViewportFrame>

<style>
	.workflow-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 20px 22px;
		background: var(--surface-panel);
		border-bottom: 1px solid var(--hairline);
	}

	.workflow-header h1 {
		margin: 6px 0 0;
		font-size: 20px;
		font-weight: 600;
	}

	.order {
		font-size: 11px;
		color: var(--text-muted);
	}

	.pack {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 1px;
		background: var(--hairline);
		min-height: calc(900px - 100px);
	}

	.directive,
	.override-panel {
		background: var(--surface-panel);
		padding: 24px 22px;
	}

	.use-label {
		margin: 0;
	}

	.carton {
		margin: 10px 0 6px;
		font-size: 28px;
		font-weight: 600;
		color: var(--green);
	}

	.billable {
		margin: 0;
		font-size: 12px;
		color: var(--text-muted);
	}

	.diagram {
		display: flex;
		gap: 32px;
		align-items: center;
		margin: 28px 0;
	}

	.box-iso {
		position: relative;
		width: 120px;
		height: 100px;
	}

	.face {
		position: absolute;
		border: 2px solid var(--green);
		background: var(--green-tint);
	}

	.top {
		width: 80px;
		height: 48px;
		transform: skewX(-30deg) translate(24px, 0);
		opacity: 0.85;
	}

	.front {
		width: 80px;
		height: 56px;
		bottom: 0;
		left: 12px;
	}

	.side {
		width: 40px;
		height: 56px;
		bottom: 0;
		left: 72px;
		transform: skewY(-30deg);
		transform-origin: bottom left;
		opacity: 0.7;
	}

	.items {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 12px;
		color: var(--text-secondary);
		line-height: 1.8;
	}

	.confirm {
		margin-top: 8px;
		padding: 12px 18px;
		border: none;
		border-radius: var(--radius-lg);
		background: var(--green);
		color: white;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.confirmed {
		margin-top: 16px;
		color: var(--green);
		font-weight: 600;
	}

	.block {
		padding: 20px;
		border: 2px solid var(--amber);
		background: var(--amber-tint);
		border-radius: var(--radius-lg);
	}

	.block h2 {
		margin: 0 0 8px;
		color: var(--amber);
		font-size: 16px;
	}

	.override-panel select {
		display: block;
		width: 100%;
		margin-top: 8px;
		padding: 10px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: white;
		font-size: 11px;
	}

	.note {
		margin-top: 12px;
		font-size: 10px;
		color: var(--text-muted);
	}

	.d-skel {
		height: 200px;
		width: 70%;
	}
</style>
