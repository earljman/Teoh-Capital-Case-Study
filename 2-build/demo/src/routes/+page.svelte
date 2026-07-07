<script lang="ts">
	import { page } from '$app/state';
	import { parseDemoState } from '$lib/demo/parse-state';
	import ViewportFrame from '$lib/components/ViewportFrame.svelte';
	import DashboardChrome from '$lib/components/DashboardChrome.svelte';
	import BigThreeCard from '$lib/components/BigThreeCard.svelte';
	import ExecutiveMetricChip from '$lib/components/ExecutiveMetricChip.svelte';
	import PortfolioTrendChart from '$lib/components/PortfolioTrendChart.svelte';
	import HelpTitle from '$lib/components/HelpTitle.svelte';
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
					<HelpTitle helpId="impact-band" title="Est. annual margin protected" variant="portfolio" />
					:
					<strong class="tabular-nums">{marginFormatted}</strong>
				</p>
				{#if data.hygieneNote}
					<p class="hygiene mono">{data.hygieneNote}</p>
				{/if}
			{/if}
		</section>

		<section class="top-six" aria-label="Top six executive metrics">
			{#if loading}
				<div class="skeleton top-six-skel"></div>
			{:else}
				{#each data.topMetrics as metric (metric.id)}
					<ExecutiveMetricChip {metric} />
				{/each}
			{/if}
		</section>

		<section class="portfolio-band" aria-label="8-week portfolio trend">
			{#if loading}
				<div class="skeleton portfolio-skel"></div>
			{:else}
				<p class="portfolio-title">
					<HelpTitle helpId="portfolio-trend" title="8-week portfolio trend" variant="portfolio" />
				</p>
				<PortfolioTrendChart
					weeks={data.portfolioTrend.weeks}
					labor={data.portfolioTrend.labor}
					compliance={data.portfolioTrend.compliance}
					dim={data.portfolioTrend.dim}
				/>
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

	.top-six {
		margin-top: 1px;
		padding: 12px 22px 14px;
		background: var(--surface-panel);
		border-top: 1px solid var(--hairline);
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 8px;
	}

	.portfolio-band {
		margin-top: 1px;
		padding: 14px 22px 18px;
		background: var(--surface-panel);
		border-top: 1px solid var(--hairline);
	}

	.portfolio-title {
		margin: 0 0 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}

	.band-skel {
		height: 20px;
		width: 60%;
	}

	.top-six-skel {
		height: 72px;
		width: 100%;
	}

	.portfolio-skel {
		height: 120px;
		width: 100%;
	}

	@media (max-width: 900px) {
		.big-three {
			grid-template-columns: 1fr;
		}

		.top-six {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
