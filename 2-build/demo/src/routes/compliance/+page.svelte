<script lang="ts">
	import { page } from '$app/state';
	import { parseDemoState } from '$lib/demo/parse-state';
	import { isScreenshotMode } from '$lib/demo/href';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import DashboardBackLink from '$lib/components/DashboardBackLink.svelte';
	import HelpTitle from '$lib/components/HelpTitle.svelte';
	import {
		COMPLIANCE_RULES,
		COMPLIANCE_RULES_GATED,
		DH_DC_OPTIONS,
		ROUTING_GUIDE,
		SHIP_BLOCK_ORDER,
		hasActiveRules,
		type ComplianceRule
	} from '$lib/data/compliance';

	const demoState = $derived(parseDemoState(page.url.searchParams.get('state')));
	const screenshot = $derived(isScreenshotMode(page.url.searchParams));
	const processing = $derived(demoState === 'loading');
	const isGated = $derived(demoState === 'gated');
	const isAlert = $derived(demoState === 'alert');

	const baseRules = $derived(isGated ? COMPLIANCE_RULES_GATED : COMPLIANCE_RULES);

	let rules = $state<ComplianceRule[]>([]);
	let selectedRuleId = $state(COMPLIANCE_RULES[0].id);
	let blockDismissed = $state(false);
	let activationFlash = $state<string | null>(null);

	type ShipPhase = 'idle' | 'validating' | 'pass' | 'block' | 'gated-warn';
	let shipPhase = $state<ShipPhase>('idle');

	const selectedRule = $derived(
		rules.find((r) => r.id === selectedRuleId) ?? rules[0] ?? COMPLIANCE_RULES[0]
	);

	const activeRuleCount = $derived(
		rules.filter(
			(r) => r.status === 'approved' && r.activatedFor.includes(ROUTING_GUIDE.dcTag)
		).length
	);

	const enforcementEnabled = $derived(hasActiveRules(rules));

	const showBlock = $derived(
		shipPhase === 'block' || (screenshot && isAlert && !blockDismissed)
	);
	const showPass = $derived(shipPhase === 'pass' || (screenshot && demoState === 'happy'));
	const showGatedWarn = $derived(
		shipPhase === 'gated-warn' || (screenshot && isGated)
	);
	const showValidating = $derived(shipPhase === 'validating');

	$effect(() => {
		void demoState;
		void screenshot;
		rules = baseRules.map((r) => ({ ...r, activatedFor: [...r.activatedFor] }));
		blockDismissed = false;

		if (screenshot) {
			if (isAlert) shipPhase = 'block';
			else if (isGated) shipPhase = 'gated-warn';
			else if (demoState === 'happy') shipPhase = 'pass';
			else shipPhase = 'idle';
		} else {
			shipPhase = 'idle';
		}
	});

	function toggleActivation(ruleId: string, dc: string) {
		const wasActive = rules.find((r) => r.id === ruleId)?.activatedFor.includes(dc) ?? false;
		rules = rules.map((rule) => {
			if (rule.id !== ruleId || rule.status !== 'approved') return rule;
			const active = rule.activatedFor.includes(dc);
			return {
				...rule,
				activatedFor: active
					? rule.activatedFor.filter((d) => d !== dc)
					: [...rule.activatedFor, dc]
			};
		});
		if (!wasActive) {
			activationFlash = `${ruleId}:${dc}`;
			setTimeout(() => {
				activationFlash = null;
			}, 550);
		}
	}

	async function printLabel() {
		if (processing) return;

		if (!enforcementEnabled) {
			shipPhase = 'gated-warn';
			return;
		}

		shipPhase = 'validating';
		await new Promise((r) => setTimeout(r, 180));

		if (isAlert) {
			shipPhase = 'block';
		} else {
			shipPhase = 'pass';
		}
	}

	function dismissBlock() {
		blockDismissed = true;
		shipPhase = 'idle';
	}

	const sourceTitle = `Source · ${ROUTING_GUIDE.partner} ${ROUTING_GUIDE.title} (${ROUTING_GUIDE.effectiveDate})`;
</script>

<ViewportFrame>
	<header class="workflow-header">
		<div>
			<DashboardBackLink />
			<p class="label">Slide 11 · Compliance</p>
			<h1>
				<HelpTitle
					helpId="compliance-workflow"
					title="Routing guide → rules → ship enforcement"
					variant="h1"
					as="span"
				/>
			</h1>
		</div>
		<div class="header-actions">
			<span class="tag mono">{ROUTING_GUIDE.partner} · {ROUTING_GUIDE.dcTag}</span>
			<button type="button" class="upload mono">{ROUTING_GUIDE.filename}</button>
			<a
				class="pdf-link mono"
				href={ROUTING_GUIDE.pdfUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				View full PDF ↗
			</a>
		</div>
	</header>

	<main class="compliance">
		{#if isGated && !processing}
			<div class="gated-banner mono" role="status">
				0 rules active for {ROUTING_GUIDE.dcTag} — enforcement disabled at ship
			</div>
		{/if}

		<section class="review-pane">
			<div class="pdf-pane">
				<p class="section-title">
					<HelpTitle helpId="source-pdf" title={sourceTitle} variant="section-title" />
				</p>
				{#if processing}
					<div class="processing mono">
						Extracting rules… {ROUTING_GUIDE.extractedCount} found · {ROUTING_GUIDE.ambiguousCount}
						ambiguous
					</div>
					<div class="skeleton pdf-skel"></div>
				{:else}
					{#key selectedRuleId}
						<div class="pdf-snippet motion-crossfade">
							<p class="mono page">Page {selectedRule.sourcePage}</p>
							<p>"{selectedRule.sourceSnippet}"</p>
						</div>
					{/key}
				{/if}
			</div>

			<div class="rules-pane">
				<p class="section-title">
					<HelpTitle
						helpId="extracted-rules"
						title="Extracted rules · human review required"
						variant="section-title"
					/>
				</p>
				<p class="activation-note mono">
					Never auto-activated — manager must enable per DC · {activeRuleCount} active for {ROUTING_GUIDE.dcTag}
				</p>
				{#each rules as rule (rule.id)}
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
							<span class="partner">{rule.partner}</span>
							<div class="rule-pills">
								{#if rule.penaltyCode && rule.status === 'approved'}
									<span class="pill penalty mono">{rule.penaltyCode}</span>
								{/if}
								{#if rule.status === 'ambiguous'}
									<span class="pill warn mono">Ambiguous</span>
								{:else if rule.status === 'approved'}
									<span class="pill ok mono">Approved</span>
								{/if}
							</div>
						</div>
						<p class="constraint">{rule.constraint}</p>
						<div class="rule-actions">
							<button type="button" class="btn ok">Approve</button>
							<button type="button" class="btn">Edit</button>
							<button type="button" class="btn danger">Reject</button>
						</div>
						{#if rule.status === 'approved'}
							<div class="activation-row">
								{#each DH_DC_OPTIONS as dc}
									{@const active = rule.activatedFor.includes(dc)}
									{@const flashKey = `${rule.id}:${dc}`}
									{#if dc === ROUTING_GUIDE.dcTag}
										<button
											type="button"
											class="activate mono"
											class:on={active}
											class:motion-activate-pulse={activationFlash === flashKey}
											onclick={(e) => {
												e.stopPropagation();
												toggleActivation(rule.id, dc);
											}}
										>
											{active ? 'Active' : 'Activate'} · {dc}
										</button>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<section class="floor-pane">
			<p class="section-title">
				<HelpTitle helpId="ship-station" title="Ship station · enforcement" variant="section-title" />
			</p>
			<div class="ship-card">
				{#if processing}
					<p class="awaiting mono">Awaiting rule extraction…</p>
				{:else}
					<p class="mono">
						Order {SHIP_BLOCK_ORDER.po} · {SHIP_BLOCK_ORDER.partner}
					</p>

					{#if showValidating}
						<p class="validating mono motion-validating">Running compliance check…</p>
					{:else if showBlock}
						<div class="block-modal motion-block-modal" role="alertdialog" aria-labelledby="block-title">
							<h2 id="block-title">Ship blocked</h2>
							<p>{SHIP_BLOCK_ORDER.violation}</p>
							<button type="button" class="fix mono" onclick={dismissBlock}>
								{SHIP_BLOCK_ORDER.fixAction}
							</button>
						</div>
					{:else if showPass}
						<p class="pass mono motion-pass">Validator passed · label printed</p>
					{:else if showGatedWarn}
						<div class="gated-warn" role="status">
							<p class="mono">
								No rules activated for {ROUTING_GUIDE.partner} · {ROUTING_GUIDE.dcTag} — ship not
								enforced
							</p>
						</div>
					{:else}
						<button type="button" class="print mono" onclick={printLabel}>
							Print shipping label
						</button>
					{/if}
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

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
	}

	.tag {
		padding: 6px 10px;
		border: 1px solid var(--green-outline);
		border-radius: var(--radius-lg);
		background: var(--green-tint);
		color: var(--green);
		font-size: 9px;
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

	.pdf-link {
		font-size: 10px;
		font-weight: 600;
		color: var(--text-secondary);
		text-decoration: none;
	}

	.pdf-link:hover {
		color: var(--green);
	}

	.compliance {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: calc(900px - 120px);
	}

	.gated-banner {
		padding: 10px 20px;
		background: var(--amber-tint);
		border-bottom: 1px solid var(--amber);
		color: var(--amber);
		font-size: 11px;
		font-weight: 600;
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

	.activation-note {
		margin: 0 0 8px;
		font-size: 9px;
		color: var(--text-faint);
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
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
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

	.rule-pills {
		display: flex;
		gap: 6px;
		flex-shrink: 0;
	}

	.partner {
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

	.pill.penalty {
		background: var(--surface-panel);
		color: var(--text-faint);
		border: 1px solid var(--hairline);
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

	.activation-row {
		margin-top: 10px;
		padding-top: 10px;
		border-top: 1px solid var(--hairline);
	}

	.activate {
		padding: 5px 10px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: var(--surface-panel);
		font-size: 9px;
		font-weight: 600;
		cursor: pointer;
		color: var(--text-faint);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}

	.activate.on {
		border-color: var(--green-outline);
		background: var(--green-tint);
		color: var(--green);
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

	.awaiting,
	.validating {
		margin: 12px 0 0;
		font-size: 11px;
		color: var(--text-faint);
	}

	.print {
		margin-top: 12px;
		padding: 10px 14px;
		border: 1px solid var(--green-outline);
		border-radius: var(--radius-lg);
		background: var(--green-tint);
		color: var(--green);
		font-size: 11px;
		font-weight: 600;
		cursor: pointer;
	}

	.pass {
		margin: 12px 0 0;
		color: var(--green);
		font-weight: 600;
	}

	.gated-warn {
		margin-top: 12px;
		padding: 14px;
		border: 1px solid var(--amber);
		background: var(--amber-tint);
		border-radius: var(--radius-lg);
		color: var(--amber);
		font-weight: 600;
		font-size: 12px;
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
