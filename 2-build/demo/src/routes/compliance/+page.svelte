<script lang="ts">
	import { page } from '$app/state';
	import { parseDemoState } from '$lib/demo/parse-state';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import DashboardBackLink from '$lib/components/DashboardBackLink.svelte';
	import { COMPLIANCE_RULES, SHIP_BLOCK_ORDER } from '$lib/data/compliance';

	const demoState = $derived(parseDemoState(page.url.searchParams.get('state')));
	const processing = $derived(demoState === 'loading');

	let blockDismissed = $state(false);
	const showBlock = $derived(demoState === 'alert' && !blockDismissed);

	$effect(() => {
		void demoState;
		blockDismissed = false;
	});

	let selectedRuleId = $state(COMPLIANCE_RULES[0].id);
	const selectedRule = $derived(
		COMPLIANCE_RULES.find((r) => r.id === selectedRuleId) ?? COMPLIANCE_RULES[0]
	);
</script>

<ViewportFrame>
	<header class="workflow-header">
		<div>
			<DashboardBackLink />
			<p class="label">Slide 11 · Compliance</p>
			<h1>Routing guide → rules → ship enforcement</h1>
		</div>
		<button type="button" class="upload mono">Upload routing guide PDF</button>
	</header>

	<main class="compliance">
		<section class="review-pane">
			<div class="pdf-pane">
				<p class="section-title">Source · Walmart Routing Guide v4.1</p>
				{#if processing}
					<div class="processing mono">Extracting rules… 47 found · 3 ambiguous</div>
					<div class="skeleton pdf-skel"></div>
				{:else}
					<div class="pdf-snippet">
						<p class="mono page">Page {selectedRule.sourcePage}</p>
						<p>
							"Shipping labels shall be applied to the <strong>short end</strong> of the carton,
							positioned 2–4 inches from the top edge…"
						</p>
					</div>
				{/if}
			</div>

			<div class="rules-pane">
				<p class="section-title">Extracted rules · human review required</p>
				{#each COMPLIANCE_RULES as rule (rule.id)}
					<div
						class="rule-card"
						class:selected={rule.id === selectedRuleId}
						role="button"
						tabindex="0"
						onclick={() => (selectedRuleId = rule.id)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								selectedRuleId = rule.id;
							}
						}}
					>
						<div class="rule-head">
							<span class="retailer">{rule.retailer}</span>
							{#if rule.status === 'ambiguous'}
								<span class="pill warn mono">Ambiguous</span>
							{:else if rule.status === 'approved'}
								<span class="pill ok mono">Approved</span>
							{/if}
						</div>
						<p class="constraint">{rule.constraint}</p>
						<div class="rule-actions">
							<button type="button" class="btn ok">Approve</button>
							<button type="button" class="btn">Edit</button>
							<button type="button" class="btn danger">Reject</button>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="floor-pane">
			<p class="section-title">Ship station · enforcement</p>
			<div class="ship-card">
				<p class="mono">Order {SHIP_BLOCK_ORDER.po} · {SHIP_BLOCK_ORDER.retailer}</p>
				{#if showBlock}
					<div class="block-modal" role="alertdialog" aria-labelledby="block-title">
						<h2 id="block-title">Ship blocked</h2>
						<p>{SHIP_BLOCK_ORDER.violation}</p>
						<button
							type="button"
							class="fix mono"
							onclick={() => (blockDismissed = true)}
						>
							{SHIP_BLOCK_ORDER.fixAction}
						</button>
					</div>
				{:else}
					<p class="pass mono">Validator passed · label printed</p>
				{/if}
			</div>
		</section>
	</main>
</ViewportFrame>

<style>
	.workflow-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding: 20px 22px;
		background: var(--surface-panel);
		border-bottom: 1px solid var(--hairline);
	}

	.workflow-header h1 {
		margin: 6px 0 0;
		font-size: 20px;
		font-weight: 600;
	}

	.upload {
		padding: 10px 14px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: white;
		font-size: 10px;
		font-weight: 600;
		cursor: pointer;
	}

	.compliance {
		display: grid;
		grid-template-rows: 1fr auto;
		min-height: calc(900px - 120px);
	}

	.review-pane {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		background: var(--hairline);
	}

	.pdf-pane,
	.rules-pane,
	.floor-pane {
		background: var(--surface-panel);
		padding: 18px 20px;
	}

	.pdf-snippet {
		margin-top: 12px;
		padding: 16px;
		border: 1px solid var(--separator);
		background: white;
		font-size: 13px;
		line-height: 1.55;
	}

	.page {
		font-size: 10px;
		color: var(--text-faint);
		margin: 0 0 8px;
	}

	.processing {
		margin: 12px 0;
		font-size: 11px;
		color: var(--amber);
	}

	.rule-card {
		display: block;
		width: 100%;
		margin-top: 10px;
		padding: 14px;
		border: 1px solid var(--separator);
		border-radius: var(--radius-lg);
		background: white;
		text-align: left;
		cursor: pointer;
	}

	.rule-card.selected {
		border-color: var(--green);
		box-shadow: 0 0 0 1px var(--green-outline);
	}

	.rule-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.retailer {
		font-weight: 600;
		font-size: 12px;
	}

	.pill {
		font-size: 9px;
		font-weight: 600;
		padding: 2px 7px;
		border-radius: var(--radius-md);
	}

	.pill.warn {
		background: var(--amber-tint);
		color: var(--amber);
	}

	.pill.ok {
		background: rgba(31, 122, 77, 0.1);
		color: var(--green);
	}

	.constraint {
		margin: 8px 0 12px;
		font-size: 12px;
		color: var(--text-secondary);
	}

	.rule-actions {
		display: flex;
		gap: 8px;
	}

	.btn {
		padding: 6px 10px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: var(--surface-panel);
		font-size: 10px;
		cursor: pointer;
	}

	.btn.ok {
		border-color: var(--green-outline);
		background: var(--green-tint);
		color: var(--green);
		font-weight: 600;
	}

	.btn.danger {
		color: var(--red);
	}

	.floor-pane {
		border-top: 1px solid var(--hairline);
	}

	.ship-card {
		margin-top: 12px;
		padding: 16px;
		border: 1px solid var(--separator);
		background: white;
		min-height: 120px;
		position: relative;
	}

	.pass {
		margin: 12px 0 0;
		color: var(--green);
		font-weight: 600;
	}

	.block-modal {
		margin-top: 12px;
		padding: 16px;
		border: 2px solid var(--red);
		background: var(--red-tint);
		border-radius: var(--radius-lg);
	}

	.block-modal h2 {
		margin: 0 0 8px;
		font-size: 16px;
		color: var(--red);
	}

	.fix {
		margin-top: 12px;
		padding: 10px 14px;
		border: none;
		border-radius: var(--radius-lg);
		background: var(--red);
		color: white;
		font-weight: 600;
		cursor: pointer;
	}

	.pdf-skel {
		height: 160px;
		margin-top: 12px;
	}
</style>
