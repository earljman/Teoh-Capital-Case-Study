<script lang="ts">
	import Sparkline from './Sparkline.svelte';
	import HelpTitle from './HelpTitle.svelte';
	import { demoHref } from '$lib/demo/href';
	import type { BigThreeCardData } from '$lib/data/executive';
	import type { HelpId } from '$lib/data/help-content';

	const CARD_HELP: Record<BigThreeCardData['id'], HelpId> = {
		labor: 'labor-saved',
		compliance: 'compliance-risk',
		dim: 'dim-waste'
	};

	let {
		card,
		loading = false
	}: {
		card: BigThreeCardData;
		loading?: boolean;
	} = $props();

	const accentColor = $derived(
		card.muted
			? 'var(--text-faint)'
			: card.accent === 'red'
				? 'var(--red)'
				: card.accent === 'amber'
					? 'var(--amber)'
					: 'var(--green)'
	);

	const workflowUrl = $derived(
		demoHref(card.workflowHref, { state: card.workflowState })
	);
</script>

<article class="big-three-card" class:muted={card.muted} class:loading>
	<header>
		<HelpTitle helpId={CARD_HELP[card.id]} title={card.title} variant="label" />
	</header>
	{#if loading}
		<div class="skeleton primary-skel"></div>
		<div class="skeleton secondary-skel"></div>
		<div class="skeleton spark-skel"></div>
	{:else}
		<p class="primary mono tabular-nums" style:color={accentColor}>{card.primary}</p>
		<p class="secondary mono">{card.secondary}</p>
		{#if card.microLine}
			<p class="micro mono">{card.microLine}</p>
		{/if}
		{#if card.muted && card.mutedReason}
			<p class="muted-note">{card.mutedReason}</p>
		{:else}
			<Sparkline values={card.sparkline} stroke={accentColor} />
		{/if}
	{/if}
	<a class="workflow-link mono" href={workflowUrl}>{card.workflowLabel}</a>
</article>

<style>
	.big-three-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 20px 22px;
		background: var(--surface-panel);
		min-height: 168px;
		border-radius: var(--radius-md);
	}

	.big-three-card.muted {
		opacity: 0.72;
	}

	.primary {
		margin: 0;
		font-size: 26px;
		font-weight: 500;
		letter-spacing: -0.01em;
		line-height: 1.15;
	}

	.secondary {
		margin: 0;
		font-size: 11px;
		color: var(--text-muted);
	}

	.micro {
		margin: -2px 0 0;
		font-size: 10px;
		color: var(--text-faint);
	}

	.muted-note {
		margin: 0;
		font-size: 10px;
		color: var(--amber);
	}

	.workflow-link {
		margin-top: auto;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--green);
		text-decoration: none;
	}

	.workflow-link:hover {
		text-decoration: underline;
	}

	.primary-skel {
		height: 28px;
		width: 70%;
	}

	.secondary-skel {
		height: 12px;
		width: 50%;
	}

	.spark-skel {
		height: 32px;
		width: 120px;
	}
</style>
