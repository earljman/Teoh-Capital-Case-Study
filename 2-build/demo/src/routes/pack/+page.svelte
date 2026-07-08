<script lang="ts">
	import { page } from '$app/state';
	import { parseDemoState } from '$lib/demo/parse-state';
	import { isScreenshotMode } from '$lib/demo/href';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import DashboardBackLink from '$lib/components/DashboardBackLink.svelte';
	import HelpTitle from '$lib/components/HelpTitle.svelte';
	import {
		OVERRIDE_REASONS,
		PACK_COMPLIANCE_BLOCK,
		PACK_DIRECTIVE,
		PACKER_INSTRUCTIONS,
		type PackFlowStep,
		type PackerInstructions
	} from '$lib/data/pack';
	import { recordPackComplete } from '$lib/telemetry';

	const demoState = $derived(parseDemoState(page.url.searchParams.get('state')));
	const screenshot = $derived(isScreenshotMode(page.url.searchParams));

	const STEPS: { id: PackFlowStep; label: string }[] = [
		{ id: 'scan', label: 'Scan' },
		{ id: 'directive', label: 'Pack' },
		{ id: 'weigh', label: 'Weigh' },
		{ id: 'label', label: 'Ship' }
	];

	let flowStep = $state<PackFlowStep>('scan');
	let calculating = $state(false);
	let showOverride = $state(false);
	let overrideReason = $state<string>(OVERRIDE_REASONS[0]);
	let labelPrinted = $state(false);
	let blockDismissed = $state(false);
	let labelValidating = $state(false);

	const isWholesaleBlock = $derived(demoState === 'alert');
	const orderLabel = $derived(
		isWholesaleBlock ? PACK_COMPLIANCE_BLOCK.orderId : PACK_DIRECTIVE.orderId
	);
	const toteLabel = $derived(
		isWholesaleBlock ? PACK_COMPLIANCE_BLOCK.toteId : PACK_DIRECTIVE.toteId
	);
	const partnerLabel = $derived(
		isWholesaleBlock ? PACK_COMPLIANCE_BLOCK.partner : PACK_DIRECTIVE.retailer
	);

	const billableLb = $derived(PACK_DIRECTIVE.estimatedBillableLb);
	const actualLb = $derived(PACK_DIRECTIVE.actualWeightLb);
	const dimWins = $derived(billableLb >= actualLb);

	const showComplianceBlock = $derived(
		flowStep === 'label' && isWholesaleBlock && labelPrinted && !blockDismissed
	);
	const shipPassed = $derived(
		flowStep === 'label' && labelPrinted && !showComplianceBlock
	);

	const stepIndex = $derived(
		STEPS.findIndex((s) => s.id === flowStep || (flowStep === 'calculate' && s.id === 'directive'))
	);

	const stepInstructions = $derived.by((): PackerInstructions => {
		if (flowStep === 'scan') return PACKER_INSTRUCTIONS.scan;
		if (flowStep === 'calculate' || calculating) return PACKER_INSTRUCTIONS.calculate;
		if (flowStep === 'directive') {
			return demoState === 'gated' ? PACKER_INSTRUCTIONS.gated : PACKER_INSTRUCTIONS.pack;
		}
		if (flowStep === 'weigh') return PACKER_INSTRUCTIONS.weigh;
		if (showComplianceBlock) return PACKER_INSTRUCTIONS.labelBlock;
		if (shipPassed) return PACKER_INSTRUCTIONS.labelPass;
		return PACKER_INSTRUCTIONS.labelPrint;
	});

	$effect(() => {
		void demoState;
		void screenshot;
		labelPrinted = false;
		blockDismissed = false;
		calculating = false;
		labelValidating = false;
		showOverride = demoState === 'alert' || demoState === 'gated';

		if (screenshot) {
			if (demoState === 'loading') {
				flowStep = 'calculate';
				calculating = true;
			} else if (demoState === 'gated') {
				flowStep = 'directive';
			} else if (demoState === 'alert') {
				flowStep = 'label';
				labelPrinted = true;
			} else {
				flowStep = 'directive';
			}
		} else {
			flowStep = 'scan';
		}
	});

	async function scanTote() {
		if (demoState === 'gated') {
			flowStep = 'directive';
			return;
		}

		if (demoState === 'loading') {
			flowStep = 'calculate';
			calculating = true;
			await new Promise((r) => setTimeout(r, 1800));
			calculating = false;
		}

		flowStep = 'directive';
	}

	function confirmPack() {
		flowStep = 'weigh';
	}

	function confirmWeight() {
		flowStep = 'label';
	}

	async function printLabel() {
		labelValidating = true;
		await new Promise((r) => setTimeout(r, 180));
		labelValidating = false;
		labelPrinted = true;
		if (!isWholesaleBlock) {
			recordPackComplete();
		}
	}

	function dismissBlock() {
		blockDismissed = true;
	}
</script>

<ViewportFrame>
	<header class="workflow-header">
		<div>
			<DashboardBackLink />
			<p class="label">Slide 13 · Cartonization</p>
			<h1>
				<HelpTitle
					helpId="pack-workflow"
					title="Pack station"
					variant="h1"
					as="span"
				/>
			</h1>
		</div>
		<div class="order-meta">
			<p class="mono">{partnerLabel}</p>
			<p class="order mono">Order {orderLabel} · {toteLabel}</p>
		</div>
	</header>

	<nav class="step-rail" aria-label="Pack workflow progress">
		{#each STEPS as step, i}
			<span
				class="step"
				class:done={i < stepIndex}
				class:active={i === stepIndex || (flowStep === 'calculate' && step.id === 'directive')}
			>
				{step.label}
			</span>
			{#if i < STEPS.length - 1}
				<span class="sep" aria-hidden="true"></span>
			{/if}
		{/each}
	</nav>

	<main class="pack">
		<section class="directive">
			<aside class="step-instructions" aria-label="What to do now">
				<p class="instructions-label mono">What to do</p>
				<p class="instructions-lead">{stepInstructions.lead}</p>
				<ol class="instructions-list">
					{#each stepInstructions.actions as action}
						<li>{action}</li>
					{/each}
				</ol>
			</aside>

			{#if flowStep === 'scan'}
				<div class="scan-stage">
					<p class="section-title">
						<HelpTitle helpId="pack-scan" title="Scan tote" variant="section-title" />
					</p>
					<p class="body muted">
						Scan the picked tote or order barcode to load cartonization.
					</p>
					<button type="button" class="scan-btn" onclick={scanTote}>
						Scan tote · order barcode
					</button>
				</div>
			{:else if flowStep === 'calculate' || calculating}
				<div class="calculate">
					<div class="spinner"></div>
					<p class="mono">Calculating pack…</p>
				</div>
			{:else if flowStep === 'directive'}
				{#if demoState === 'gated'}
					<div class="block">
						<h2>
							<HelpTitle helpId="pack-directive" title="Pack blocked" variant="h2" as="span" />
						</h2>
						<p class="mono">SKU-99201 missing dimensions — capture at receiving</p>
					</div>
				{:else}
					<div class="directive-reveal motion-reveal">
						<p class="use-label section-title">
							<HelpTitle helpId="pack-directive" title="Use carton" variant="section-title" />
						</p>
						<p class="carton mono">{PACK_DIRECTIVE.carton} — {PACK_DIRECTIVE.dimensions}</p>
						<p class="billable mono">
							Est. billable: {billableLb.toFixed(1)} lb (DIM)
						</p>

						<div class="diagram" aria-hidden="true">
							<div class="box-iso">
								<div class="face top"></div>
								<div class="face front"></div>
								<div class="face side"></div>
							</div>
							<div class="diagram-notes">
								<ul class="items">
									{#each PACK_DIRECTIVE.items as item}
										<li class="mono">{item.qty}× {item.sku}</li>
									{/each}
								</ul>
								<ul class="hints">
									<li class="mono">{PACK_DIRECTIVE.hints.placement}</li>
									<li class="mono">{PACK_DIRECTIVE.hints.voidFill}</li>
									<li class="mono implied">{PACK_DIRECTIVE.hints.multiCarton}</li>
								</ul>
							</div>
						</div>

						<div class="directive-actions">
							<button type="button" class="confirm" onclick={confirmPack}>Confirm pack</button>
							<button
								type="button"
								class="ghost"
								onclick={() => (showOverride = !showOverride)}
							>
								{showOverride ? 'Hide override' : 'Use different box'}
							</button>
						</div>
					</div>
				{/if}
			{:else if flowStep === 'weigh'}
				<div class="weigh-stage motion-reveal">
					<p class="section-title">
						<HelpTitle helpId="pack-weigh" title="Capture weight" variant="section-title" />
					</p>
					<div class="weight-compare">
						<div class="weight-card">
							<span class="weight-label">Actual (scale)</span>
							<span class="weight-value mono">{actualLb.toFixed(1)} lb</span>
						</div>
						<div class="weight-card" class:dim-wins={dimWins} class:motion-weight-win={dimWins}>
							<span class="weight-label">Billable (carrier)</span>
							<span class="weight-value mono">
								{billableLb.toFixed(1)} lb {dimWins ? '· DIM' : '· actual'}
								{#if dimWins}✓{/if}
							</span>
						</div>
					</div>
					<p class="hint mono">
						Carrier bills whichever is higher — actual vs. dimensional weight.
					</p>
					<button type="button" class="confirm" onclick={confirmWeight}>
						Confirm weight · continue
					</button>
				</div>
			{:else if flowStep === 'label'}
				<div class="label-stage">
					<p class="section-title">
						<HelpTitle helpId="pack-ship" title="Print label" variant="section-title" />
					</p>

					{#if labelValidating}
						<p class="validating mono motion-validating">Running compliance check…</p>
					{:else if !labelPrinted}
						<button type="button" class="confirm" onclick={printLabel}>Print shipping label</button>
					{:else if showComplianceBlock}
						<div class="block-modal motion-block-modal" role="alertdialog" aria-labelledby="block-title">
							<h2 id="block-title">Ship blocked</h2>
							<p class="mono">{PACK_COMPLIANCE_BLOCK.violation}</p>
							<button type="button" class="fix mono" onclick={dismissBlock}>
								{PACK_COMPLIANCE_BLOCK.fixAction}
							</button>
						</div>
					{:else if shipPassed}
						<p class="passed mono motion-pass">Validator passed · label printed · ship cleared</p>
					{/if}
				</div>
			{/if}
		</section>

		{#if showOverride && flowStep === 'directive' && demoState !== 'gated'}
			<aside class="override-panel">
				<p class="section-title">
					<HelpTitle helpId="override-panel" title="Override" variant="section-title" />
				</p>
				<p class="override-lead">{PACKER_INSTRUCTIONS.override.lead}</p>
				<ol class="override-list">
					{#each PACKER_INSTRUCTIONS.override.actions as action}
						<li class="mono">{action}</li>
					{/each}
				</ol>
				<label class="mono" for="reason">Reason code (required)</label>
				<select id="reason" bind:value={overrideReason}>
					{#each OVERRIDE_REASONS as reason}
						<option value={reason}>{reason}</option>
					{/each}
				</select>
				<p class="note mono">Override feeds hygiene alerts on supervisor console</p>
			</aside>
		{/if}
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

	.order-meta {
		text-align: right;
	}

	.order-meta p {
		margin: 0;
	}

	.order {
		font-size: 11px;
		color: var(--text-muted);
	}

	.step-rail {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 22px;
		background: var(--surface-base);
		border-bottom: 1px solid var(--hairline);
		font-size: 10px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.step {
		color: var(--text-faint);
		position: relative;
		transition: color 0.25s ease;
	}

	.step.active {
		color: var(--green);
	}

	.step.active::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -10px;
		height: 2px;
		background: var(--green);
		border-radius: 1px;
		animation: pass-in 0.25s ease-out both;
	}

	.step.done {
		color: var(--text-muted);
		transition: color 0.25s ease;
	}

	.sep {
		flex: 1;
		height: 1px;
		background: var(--separator);
		max-width: 48px;
	}

	.pack {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1px;
		background: var(--hairline);
		min-height: calc(900px - 140px);
	}

	.pack:has(.override-panel) {
		grid-template-columns: 1fr 280px;
	}

	.directive,
	.override-panel {
		background: var(--surface-panel);
		padding: 24px 22px;
	}

	.directive {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.step-instructions {
		padding: 14px 16px;
		border: 1px solid var(--green-outline);
		border-radius: var(--radius-lg);
		background: var(--green-tint);
	}

	.instructions-label {
		margin: 0 0 6px;
		font-size: 9px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--green);
	}

	.instructions-lead {
		margin: 0 0 10px;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.4;
		color: var(--text-primary);
	}

	.instructions-list {
		margin: 0;
		padding-left: 18px;
		font-size: 12px;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.instructions-list li + li {
		margin-top: 6px;
	}

	.scan-stage,
	.calculate,
	.weigh-stage,
	.label-stage {
		max-width: 520px;
	}

	.body.muted {
		margin: 8px 0 20px;
		font-size: 13px;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.scan-btn {
		display: block;
		width: 100%;
		max-width: 360px;
		padding: 14px 18px;
		border: none;
		border-radius: var(--radius-lg);
		background: var(--green);
		color: white;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.hint {
		margin: 14px 0 0;
		font-size: 10px;
		color: var(--text-muted);
		line-height: 1.5;
	}

	.hints li.implied {
		color: var(--text-faint);
		font-style: italic;
	}

	.calculate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-height: 240px;
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
		align-items: flex-start;
		margin: 28px 0;
	}

	.box-iso {
		position: relative;
		width: 120px;
		height: 100px;
		flex-shrink: 0;
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

	.diagram-notes {
		flex: 1;
	}

	.items,
	.hints {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 12px;
		color: var(--text-secondary);
		line-height: 1.8;
	}

	.hints {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid var(--separator);
		font-size: 11px;
		color: var(--text-muted);
	}

	.directive-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 8px;
	}

	.confirm {
		padding: 12px 18px;
		border: none;
		border-radius: var(--radius-lg);
		background: var(--green);
		color: white;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.ghost {
		padding: 12px 18px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: white;
		color: var(--text-secondary);
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.weight-compare {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin: 16px 0;
	}

	.weight-card {
		padding: 16px;
		border: 1px solid var(--separator);
		border-radius: var(--radius-lg);
		background: white;
		transition:
			border-color 0.25s ease,
			background 0.25s ease;
	}

	.weight-card.dim-wins {
		border-color: var(--green-outline);
		background: var(--green-tint);
	}

	.weight-label {
		display: block;
		font-size: 10px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-muted);
		margin-bottom: 6px;
	}

	.weight-value {
		font-size: 22px;
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

	.passed {
		margin: 16px 0 0;
		color: var(--green);
		font-weight: 600;
		font-size: 13px;
	}

	.validating {
		margin: 16px 0 0;
		font-size: 11px;
		color: var(--text-faint);
	}

	.directive-reveal {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.block-modal {
		margin-top: 16px;
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

	.override-panel {
		width: 280px;
	}

	.override-lead {
		margin: 8px 0 10px;
		font-size: 12px;
		font-weight: 600;
		line-height: 1.45;
		color: var(--text-secondary);
	}

	.override-list {
		margin: 0 0 16px;
		padding-left: 16px;
		font-size: 10px;
		line-height: 1.55;
		color: var(--text-muted);
	}

	.override-list li + li {
		margin-top: 4px;
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
</style>
