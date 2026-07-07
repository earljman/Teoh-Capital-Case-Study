<script lang="ts">
	import HelpStateViz from './HelpStateViz.svelte';
	import type { HelpContent } from '$lib/data/help-content';

	let {
		content,
		onclose
	}: {
		content: HelpContent;
		onclose: () => void;
	} = $props();

	const titleId = $props.id();

	const rows = $derived([
		{ key: 'why', label: 'Why it matters', body: content.why },
		{ key: 'how', label: 'How to read it', body: content.howToRead },
		{ key: 'use', label: "What it's used for", body: content.usedFor }
	] as const);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="backdrop" role="presentation" onclick={onclose}></div>
<div
	class="help-modal"
	role="dialog"
	aria-modal="true"
	aria-labelledby={titleId}
	tabindex="-1"
>
	<header class="modal-head">
		<div class="head-copy">
			<p class="eyebrow">Field guide</p>
			<h2 id={titleId}>{content.title}</h2>
		</div>
		<button type="button" class="close mono" onclick={onclose} aria-label="Close">Esc</button>
	</header>

	<div class="modal-body">
		<p class="lead">{content.what}</p>

		{#if content.states}
			<HelpStateViz viz={content.states} />
		{/if}

		<div class="spec-rows">
			{#each rows as row (row.key)}
				<article class="spec-row">
					<h3 class="spec-label">{row.label}</h3>
					<p class="spec-body">{row.body}</p>
				</article>
			{/each}
		</div>
	</div>

	<footer class="modal-foot">
		<button type="button" class="dismiss mono" onclick={onclose}>Got it</button>
	</footer>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(20, 25, 23, 0.42);
		text-transform: none;
		letter-spacing: normal;
		font-family: var(--font-sans);
	}

	.help-modal {
		position: fixed;
		z-index: 201;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(520px, calc(100vw - 32px));
		max-height: min(82vh, 680px);
		display: flex;
		flex-direction: column;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: var(--surface-panel);
		overflow: hidden;
		text-transform: none;
		letter-spacing: normal;
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 400;
	}

	.modal-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 18px 14px;
		border-bottom: 1px solid var(--hairline);
		background: var(--surface-panel);
	}

	.head-copy {
		min-width: 0;
	}

	.eyebrow {
		margin: 0 0 6px;
		font-size: 11px;
		font-weight: 500;
		color: var(--text-muted);
	}

	.head-copy h2 {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: -0.01em;
		color: var(--text-primary);
	}

	.close {
		flex-shrink: 0;
		padding: 5px 8px;
		border: 1px solid var(--badge-border);
		border-radius: var(--radius-md);
		background: white;
		color: var(--text-muted);
		font-size: 10px;
		font-weight: 500;
		cursor: pointer;
	}

	.close:hover {
		color: var(--text-primary);
		border-color: var(--hairline);
	}

	.modal-body {
		padding: 16px 18px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.lead {
		margin: 0;
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.spec-rows {
		display: grid;
		gap: 8px;
	}

	.spec-row {
		padding: 10px 12px 10px 14px;
		border: 1px solid var(--separator);
		border-left: 2px solid var(--green);
		border-radius: var(--radius-md);
		background: white;
	}

	.spec-label {
		margin: 0 0 5px;
		font-size: 12px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.spec-body {
		margin: 0;
		font-size: 13px;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.modal-foot {
		display: flex;
		justify-content: flex-end;
		padding: 12px 18px 14px;
		border-top: 1px solid var(--hairline);
		background: var(--surface-panel);
	}

	.dismiss {
		padding: 8px 14px;
		border: 1px solid var(--green-outline);
		border-radius: var(--radius-lg);
		background: var(--green-tint);
		color: var(--green);
		font-size: 11px;
		font-weight: 600;
		cursor: pointer;
	}

	.dismiss:hover {
		background: var(--green-soft);
	}
</style>
