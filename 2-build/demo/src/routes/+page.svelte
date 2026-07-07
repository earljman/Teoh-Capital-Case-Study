<script lang="ts">
	import { page } from '$app/state';
	import { parseDemoState } from '$lib/demo/parse-state';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import DashboardChrome from '$lib/components/DashboardChrome.svelte';
	import BigThreeCard from '$lib/components/BigThreeCard.svelte';
	import {
		EXECUTIVE_ALERT,
		EXECUTIVE_GATED,
		EXECUTIVE_HAPPY,
		type ExecutiveDashboardData
	} from '$lib/data/executive';

	const demoState = $derived(parseDemoState(page.url.searchParams.get('state')));

	const data = $derived.by((): ExecutiveDashboardData => {
		switch (demoState) {
			case 'gated':
				return EXECUTIVE_GATED;
			case 'alert':
				return EXECUTIVE_ALERT;
			default:
				return EXECUTIVE_HAPPY;
		}
	});

	const loading = $derived(demoState === 'loading');

	const marginFormatted = $derived(
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(data.annualMarginProtected)
	);
</script>

<ViewportFrame>
	<DashboardChrome
		siteLabel={data.siteLabel}
		periodLabel={data.periodLabel}
		lastRefreshed={data.lastRefreshed}
	/>

	<main class="executive">
		<section class="big-three" aria-label="Big Three margin killers">
			{#each data.cards as card (card.id)}
				<BigThreeCard {card} {loading} />
			{/each}
		</section>

		<section class="impact-band" aria-label="Combined impact">
			{#if loading}
				<div class="skeleton band-skel"></div>
			{:else}
				<p class="impact mono">
					Est. annual margin protected:
					<strong class="tabular-nums">{marginFormatted}</strong>
				</p>
				{#if data.hygieneNote}
					<p class="hygiene mono">{data.hygieneNote}</p>
				{/if}
			{/if}
		</section>
	</main>
</ViewportFrame>

<style>
	.executive {
		display: flex;
		flex-direction: column;
		min-height: calc(900px - 52px);
		background: var(--surface-base);
	}

	.big-three {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: var(--hairline);
	}

	.impact-band {
		margin-top: 1px;
		padding: 18px 22px;
		background: var(--surface-panel);
		border-top: 1px solid var(--hairline);
	}

	.impact {
		margin: 0;
		font-size: 13px;
		color: var(--text-secondary);
	}

	.impact strong {
		color: var(--text-primary);
		font-weight: 600;
	}

	.hygiene {
		margin: 8px 0 0;
		font-size: 10px;
		color: var(--amber);
	}

	.band-skel {
		height: 20px;
		width: 60%;
	}

	@media (max-width: 900px) {
		.big-three {
			grid-template-columns: 1fr;
		}
	}
</style>
