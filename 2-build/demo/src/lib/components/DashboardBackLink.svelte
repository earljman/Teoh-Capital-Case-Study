<script lang="ts">
	import { page } from '$app/state';
	import { demoHref, isScreenshotMode } from '$lib/demo/href';
	import type { DemoState } from '$lib/demo/types';

	const currentState = $derived(page.url.searchParams.get('state'));
	const href = $derived(
		demoHref('/', {
			state:
				currentState && currentState !== 'happy'
					? (currentState as DemoState)
					: undefined,
			screenshot: isScreenshotMode(page.url.searchParams)
		})
	);
</script>

<a class="dashboard-back mono" href={href}>← Dashboard</a>

<style>
	.dashboard-back {
		display: inline-block;
		margin-bottom: 4px;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--text-muted);
		text-decoration: none;
	}

	.dashboard-back:hover {
		color: var(--green);
		text-decoration: underline;
	}
</style>
