<script lang="ts">
	import HelpModal from './HelpModal.svelte';
	import { HELP_CONTENT, type HelpId } from '$lib/data/help-content';
	import { portal } from '$lib/portal';

	let {
		helpId,
		title,
		variant = 'section-title',
		light = false,
		as: tag = 'span'
	}: {
		helpId: HelpId;
		title: string;
		variant?: 'label' | 'section-title' | 'h1' | 'h2' | 'portfolio' | 'chip-label';
		light?: boolean;
		as?: 'span' | 'h1' | 'h2' | 'p';
	} = $props();

	let open = $state(false);
	const content = $derived(HELP_CONTENT[helpId]);
</script>

<span class="help-title" class:light>
	<svelte:element this={tag} class="help-trigger variant-{variant}">
		<button
			type="button"
			class="help-button"
			onclick={() => (open = true)}
			aria-haspopup="dialog"
			aria-expanded={open}
		>
			<span class="help-text">{title}</span>
			<span class="help-icon" aria-hidden="true">?</span>
			<span class="help-tooltip">Click for details</span>
		</button>
	</svelte:element>
</span>

{#if open}
	<div class="help-portal" use:portal>
		<HelpModal {content} onclose={() => (open = false)} />
	</div>
{/if}

<style>
	.help-title {
		display: inline-flex;
		max-width: 100%;
	}

	.help-trigger {
		margin: 0;
		padding: 0;
		display: inline;
	}

	.help-button {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		color: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		cursor: help;
		text-align: inherit;
		max-width: 100%;
	}

	.help-text {
		text-decoration: underline dotted transparent;
		text-underline-offset: 3px;
		transition: text-decoration-color 0.15s ease;
	}

	.help-button:hover .help-text,
	.help-button:focus-visible .help-text {
		text-decoration-color: currentColor;
	}

	.help-icon {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		border: 1px solid currentColor;
		border-radius: 50%;
		font-size: 9px;
		font-weight: 700;
		line-height: 1;
		opacity: 0.55;
		transition: opacity 0.15s ease;
	}

	.help-button:hover .help-icon,
	.help-button:focus-visible .help-icon {
		opacity: 1;
	}

	.help-tooltip {
		position: absolute;
		left: 50%;
		bottom: calc(100% + 6px);
		transform: translateX(-50%) translateY(4px);
		padding: 5px 8px;
		border-radius: var(--radius-md);
		background: var(--panel-dark);
		color: var(--panel-dark-body);
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0;
		text-transform: none;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.15s ease,
			transform 0.15s ease;
		z-index: 10;
	}

	.help-tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: var(--panel-dark);
	}

	.help-button {
		position: relative;
	}

	.help-button:hover .help-tooltip,
	.help-button:focus-visible .help-tooltip {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
	}

	.variant-label,
	.variant-section-title,
	.variant-chip-label {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.variant-portfolio {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
		letter-spacing: 0.02em;
		text-transform: none;
	}

	.variant-h1 {
		font-size: 20px;
		font-weight: 600;
		color: var(--text-primary);
		letter-spacing: normal;
		text-transform: none;
	}

	.variant-h2 {
		font-size: 16px;
		font-weight: 600;
		color: var(--red);
		letter-spacing: normal;
		text-transform: none;
	}

	.light .help-button {
		color: var(--panel-dark-heading);
	}

	.light .help-icon {
		border-color: var(--panel-dark-heading);
	}
</style>
