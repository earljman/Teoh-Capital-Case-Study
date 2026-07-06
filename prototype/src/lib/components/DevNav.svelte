<script lang="ts">
	import { page } from '$app/state';
	import { DEMO_STATES } from '$lib/demo/types';
	import { SCREENS } from '$lib/demo/screens';

	const currentPath = $derived(page.url.pathname);
	const currentState = $derived(page.url.searchParams.get('state') ?? 'happy');

	function hrefFor(path: string, state: string): string {
		const url = new URL(path, 'http://local');
		if (state !== 'happy') url.searchParams.set('state', state);
		return url.pathname + url.search;
	}
</script>

<nav class="dev-nav" aria-label="Demo navigation">
	<div class="dev-nav__brand mono">WMS Demo</div>
	<div class="dev-nav__screens">
		{#each SCREENS as screen}
			<a
				class:active={currentPath === screen.path}
				href={hrefFor(screen.path, currentState)}
			>
				{screen.label}
				<span class="dev-nav__slide">· {screen.slide}</span>
			</a>
		{/each}
	</div>
	<div class="dev-nav__states">
		<span class="label">State</span>
		{#each DEMO_STATES as state}
			<a
				class:active={currentState === state}
				href={hrefFor(currentPath, state)}
			>
				{state}
			</a>
		{/each}
	</div>
</nav>

<style>
	.dev-nav {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
		padding: 8px 16px;
		background: var(--green-deep);
		color: var(--green-soft);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 11px;
	}

	.dev-nav a {
		color: var(--panel-dark-heading);
		text-decoration: none;
		padding: 4px 8px;
		border-radius: var(--radius-lg);
	}

	.dev-nav a:hover {
		background: rgba(255, 255, 255, 0.06);
		text-decoration: none;
	}

	.dev-nav a.active {
		background: rgba(255, 255, 255, 0.12);
		color: var(--green-soft);
		font-weight: 600;
	}

	.dev-nav__brand {
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--green-soft);
		margin-right: 4px;
	}

	.dev-nav__screens,
	.dev-nav__states {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
	}

	.dev-nav__states {
		margin-left: auto;
		gap: 6px;
	}

	.dev-nav__slide {
		opacity: 0.65;
		font-weight: 400;
	}

	.dev-nav__states .label {
		color: var(--panel-dark-muted);
		margin-right: 4px;
	}
</style>
