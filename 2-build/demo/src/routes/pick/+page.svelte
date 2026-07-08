<script lang="ts">
	import { page } from '$app/state';
	import { parseDemoState } from '$lib/demo/parse-state';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import DashboardBackLink from '$lib/components/DashboardBackLink.svelte';
	import HelpTitle from '$lib/components/HelpTitle.svelte';
	import WarehouseFloorMap from '$lib/components/WarehouseFloorMap.svelte';
	import {
		PICK_BATCH,
		PICK_BATCH_START,
		PICK_BATCH_TOTAL,
		PICK_REROUTE,
		PICK_TASK,
		pickTaskAt
	} from '$lib/data/pick';
	import {
		PICK_EXCEPTION_NEXT_STEPS,
		type PickExceptionKind
	} from '$lib/data/pick-exceptions';
	import { WAREHOUSE_FLOOR_HAPPY, pinForLocation, routePathForPick, zoneLabelFromId } from '$lib/data/warehouse-floor';
	import { recordPickComplete, recordPickReroute } from '$lib/telemetry';

	type ScanStep = 'bin' | 'item' | 'tote';

	const SCAN_STEPS: { id: ScanStep; label: string }[] = [
		{ id: 'bin', label: 'Bin' },
		{ id: 'item', label: 'Item' },
		{ id: 'tote', label: 'Tote' }
	];

	const demoState = $derived(parseDemoState(page.url.searchParams.get('state')));

	let showException = $state(false);
	let rerouting = $state(false);
	let isReroute = $state(false);
	let rerouteConfirm = $state<string | null>(null);
	let exceptionModal = $state<PickExceptionKind | null>(null);
	let scanStep = $state<ScanStep>('bin');
	let batchIndex = $state(PICK_BATCH_START);
	let pickerPosition = $state({
		...pinForLocation(PICK_BATCH[PICK_BATCH_START - 1].location)
	});
	let task = $state({ ...PICK_TASK });

	$effect(() => {
		showException = demoState === 'alert';
	});

	$effect(() => {
		if (demoState !== 'rerouted') return;
		const base = pickTaskAt(PICK_BATCH_START);
		task = {
			...base,
			...PICK_REROUTE,
			batchProgress: base.batchProgress,
			walkSavedM: base.walkSavedM
		};
		isReroute = true;
		scanStep = 'bin';
		rerouteConfirm = `Rerouted to ${PICK_REROUTE.location}`;
	});

	const pickPin = $derived(pinForLocation(task.location));
	const pickRoute = $derived(
		routePathForPick(
			pickerPosition,
			{ x: pickPin.x, y: pickPin.y },
			task.avoidHotZone ?? false
		)
	);
	const routeCaption = $derived(
		isReroute
			? `Rerouted · ~${task.routeM}m · avoiding Zone C bottleneck`
			: `Route · ~${task.routeM}m to next bin`
	);
	const batchZone = $derived(zoneLabelFromId(pickPin.zoneId));
	const batchComplete = $derived(batchIndex >= PICK_BATCH.length);
	const scanStepIndex = $derived(SCAN_STEPS.findIndex((step) => step.id === scanStep));

	const scanActionLabel = $derived(
		scanStep === 'bin'
			? `Scan bin · ${task.location}`
			: scanStep === 'item'
				? `Scan item · ${task.sku}`
				: `Scan tote · ${task.toteSlot}`
	);

	function resetScanFlow() {
		scanStep = 'bin';
	}

	function openExceptionReport() {
		showException = true;
	}

	async function reportEmpty() {
		showException = false;
		rerouting = true;
		recordPickReroute(task.location);
		await new Promise((r) => setTimeout(r, 2000));
		task = {
			...task,
			...PICK_REROUTE,
			batchProgress: task.batchProgress,
			walkSavedM: task.walkSavedM
		};
		isReroute = true;
		resetScanFlow();
		rerouteConfirm = `Rerouted to ${PICK_REROUTE.location}`;
		rerouting = false;
	}

	function reportOtherException(kind: PickExceptionKind) {
		showException = false;
		exceptionModal = kind;
	}

	function advanceScan() {
		if (scanStep === 'bin') {
			scanStep = 'item';
			return;
		}
		if (scanStep === 'item') {
			scanStep = 'tote';
			return;
		}
		completePick();
	}

	function completePick() {
		recordPickComplete();
		pickerPosition = { x: pickPin.x, y: pickPin.y, zoneId: pickPin.zoneId };
		rerouteConfirm = null;

		if (isReroute) {
			isReroute = false;
		}

		const nextIndex = batchIndex + 1;
		resetScanFlow();

		if (nextIndex >= PICK_BATCH.length) {
			batchIndex = nextIndex;
			task = {
				...task,
				batchProgress: { current: nextIndex, total: PICK_BATCH_TOTAL },
				walkSavedM: task.walkSavedM + 40
			};
			return;
		}

		batchIndex = nextIndex;
		task = {
			...pickTaskAt(nextIndex, task.walkSavedM + 40)
		};
	}

	const progressPct = $derived(
		(task.batchProgress.current / task.batchProgress.total) * 100
	);
	const ringOffset = $derived(264 - (progressPct / 100) * 264);
</script>

<ViewportFrame variant="mobile">
	<div class="pick-shell">
		<header class="mobile-header">
			<div class="header-left">
				<DashboardBackLink />
				<span class="label">Slide 12 · Pick-path</span>
			</div>
			<span class="mono batch">Batch 7 · {batchZone}</span>
		</header>

		<main class="pick">
			{#if demoState === 'loading' || rerouting}
				<div class="reroute">
					<div class="spinner"></div>
					<p class="mono">Rerouting…</p>
				</div>
			{:else}
				<section class="pick-card">
					{#if rerouteConfirm}
						<div class="reroute-banner motion-banner" role="status">
							<span class="mono">{rerouteConfirm}</span>
							<button type="button" class="dismiss" onclick={() => (rerouteConfirm = null)}>
								Dismiss
							</button>
						</div>
					{/if}

					<div class="pick-top">
						<div class="pick-details">
							<p class="label">
								<HelpTitle helpId="next-pick" title="Next pick" variant="label" />
							</p>
							<p class="location mono">{task.location}</p>
							<p class="sku mono">{task.sku}</p>
							<p class="desc">{task.description}</p>
							<div class="meta">
								<span class="mono">Qty {task.qty}</span>
								<span class="mono">{task.toteSlot}</span>
							</div>
						</div>

						<div class="pick-progress">
							<p class="label">
								<HelpTitle helpId="batch-progress" title="Batch progress" variant="label" />
							</p>
							<div class="progress-ring" aria-label="Batch progress">
								<svg viewBox="0 0 100 100">
									<circle cx="50" cy="50" r="42" class="track" />
									<circle
										cx="50"
										cy="50"
										r="42"
										class="fill"
										stroke-dasharray="264"
										style:stroke-dashoffset={ringOffset}
									/>
								</svg>
								<div class="progress-label mono">
									{task.batchProgress.current} of {task.batchProgress.total}
									<span>~{task.walkSavedM}m saved</span>
								</div>
							</div>
						</div>
					</div>

					<section class="floor-route" aria-label="Pick route on warehouse floor">
						<p class="label">
							<HelpTitle helpId="pick-route" title="Your route" variant="label" />
						</p>
						{#key task.location}
							<WarehouseFloorMap
								floor={WAREHOUSE_FLOOR_HAPPY}
								variant="picker"
								width={338}
								height={124}
								activeZoneId={pickPin.zoneId}
								targetPin={{ x: pickPin.x, y: pickPin.y, label: task.location }}
								selfPosition={pickerPosition}
								routePath={pickRoute}
								routeLabel={routeCaption}
							/>
						{/key}
					</section>

					<div class="scan-actions">
						{#if batchComplete}
							<p class="batch-done mono">Batch complete — return to staging</p>
						{:else}
							<ol class="scan-steps" aria-label="Scan sequence">
								{#each SCAN_STEPS as step, index}
									<li
										class:done={index < scanStepIndex}
										class:active={index === scanStepIndex}
									>
										<span class="step-num mono" class:check={index < scanStepIndex}>
											{#if index < scanStepIndex}
												<span class="motion-check-pop" aria-hidden="true">✓</span>
											{:else}
												{index + 1}
											{/if}
										</span>
										<span>{step.label}</span>
									</li>
								{/each}
							</ol>
							<button type="button" class="scan primary" onclick={advanceScan}>
								{scanActionLabel}
							</button>
							<button type="button" class="report-issue" onclick={openExceptionReport}>
								Report issue
							</button>
						{/if}
					</div>
				</section>
			{/if}

			{#if showException && !rerouting}
				<div
					class="sheet-backdrop motion-backdrop"
					role="presentation"
					onclick={() => (showException = false)}
				></div>
				<aside class="sheet motion-sheet" aria-label="Exception report">
					<p class="section-title">
						<HelpTitle helpId="report-exception" title="Report exception" variant="section-title" />
					</p>
					<button type="button" class="sheet-btn" onclick={reportEmpty}>Bin empty</button>
					<button type="button" class="sheet-btn" onclick={() => reportOtherException('damaged')}>
						Damaged
					</button>
					<button type="button" class="sheet-btn" onclick={() => reportOtherException('wrong')}>
						Wrong item
					</button>
				</aside>
			{/if}

			{#if exceptionModal}
				{@const modal = PICK_EXCEPTION_NEXT_STEPS[exceptionModal]}
				<div
					class="sheet-backdrop motion-backdrop"
					role="presentation"
					onclick={() => (exceptionModal = null)}
				></div>
				<div class="info-modal motion-modal" role="dialog" aria-labelledby="exception-modal-title">
					<h2 id="exception-modal-title">{modal.title}</h2>
					<p>{modal.body}</p>
					<button type="button" class="scan primary" onclick={() => (exceptionModal = null)}>Got it</button>
				</div>
			{/if}
		</main>
	</div>
</ViewportFrame>

<style>
	.pick-shell {
		display: flex;
		flex-direction: column;
		height: 780px;
		overflow: hidden;
	}

	.mobile-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-shrink: 0;
		padding: 10px 14px;
		background: var(--surface-panel);
		border-bottom: 1px solid var(--hairline);
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.batch {
		font-size: 10px;
		color: var(--text-muted);
	}

	.pick {
		position: relative;
		flex: 1;
		min-height: 0;
		padding: 10px 14px 12px;
		background: var(--surface-base);
		overflow: hidden;
	}

	.pick-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		height: 100%;
		min-height: 0;
	}

	.reroute-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		flex-shrink: 0;
		padding: 8px 10px;
		border: 1px solid var(--green);
		border-radius: var(--radius-lg);
		background: var(--green-tint);
		color: var(--green);
		font-size: 11px;
		font-weight: 600;
	}

	.reroute-banner .dismiss {
		flex-shrink: 0;
		padding: 2px 6px;
		border: none;
		border-radius: var(--radius-lg);
		background: transparent;
		color: var(--green);
		font-size: 10px;
		font-weight: 600;
		cursor: pointer;
		text-decoration: underline;
	}

	.pick-top {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 96px;
		gap: 10px;
		align-items: start;
		flex-shrink: 0;
	}

	.pick-details {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.pick-details .label {
		margin: 0;
	}

	.pick-progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.pick-progress .label {
		margin: 0;
		text-align: center;
	}

	.location {
		margin: 2px 0 0;
		font-size: 26px;
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	.sku {
		margin: 0;
		font-size: 10px;
		color: var(--text-muted);
	}

	.desc {
		margin: 0;
		font-size: 13px;
		font-weight: 500;
		line-height: 1.25;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 4px;
		font-size: 11px;
		color: var(--text-secondary);
	}

	.floor-route {
		flex-shrink: 0;
		padding: 8px 10px 6px;
		border: 1px solid var(--separator);
		border-radius: var(--radius-lg);
		background: white;
	}

	.floor-route .label {
		margin: 0 0 6px;
	}

	.progress-ring {
		position: relative;
		width: 88px;
		height: 88px;
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
		transition: stroke-dashoffset 0.45s ease;
	}

	.progress-label {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		font-weight: 600;
		text-align: center;
		line-height: 1.2;
	}

	.progress-label span {
		display: block;
		margin-top: 2px;
		font-size: 8px;
		font-weight: 400;
		color: var(--text-muted);
	}

	.scan-actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex-shrink: 0;
	}

	.scan-steps {
		display: flex;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.scan-steps li {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		padding: 6px 2px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: white;
		font-size: 9px;
		font-weight: 600;
		color: var(--text-muted);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease,
			opacity 0.2s ease;
	}

	.scan-steps li.active {
		border-color: var(--green);
		background: var(--green-tint);
		color: var(--green);
	}

	.scan-steps li.done {
		border-color: var(--green);
		color: var(--green);
		opacity: 0.75;
	}

	.step-num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--separator);
		font-size: 8px;
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}

	.step-num.check {
		background: var(--green);
		color: white;
		font-size: 9px;
		line-height: 1;
	}

	.scan-steps li.active .step-num,
	.scan-steps li.done .step-num {
		background: var(--green);
		color: white;
	}

	.scan {
		padding: 12px;
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

	.report-issue {
		padding: 10px 12px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: white;
		color: var(--text-secondary);
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.batch-done {
		margin: 0;
		padding: 12px;
		border-radius: var(--radius-lg);
		background: var(--green-tint);
		color: var(--green);
		font-size: 12px;
		font-weight: 600;
		text-align: center;
	}

	.reroute {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		height: 100%;
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

	.info-modal {
		position: absolute;
		left: 16px;
		right: 16px;
		top: 50%;
		transform: translateY(-50%);
		padding: 20px;
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
		z-index: 2;
	}

	.info-modal h2 {
		margin: 0 0 10px;
		font-size: 16px;
		font-weight: 600;
	}

	.info-modal p {
		margin: 0 0 16px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.info-modal .scan {
		width: 100%;
	}
</style>
