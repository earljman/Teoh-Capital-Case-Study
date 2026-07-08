<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import DevNav from '$lib/components/DevNav.svelte';
	import { isScreenshotMode } from '$lib/demo/href';
	import { startTelemetrySimulator, stopTelemetrySimulator } from '$lib/telemetry-simulator';

	let { children } = $props();

	const hideDevNav = $derived(isScreenshotMode(page.url.searchParams));

	$effect(() => {
		if (hideDevNav) {
			stopTelemetrySimulator();
			return;
		}
		startTelemetrySimulator();
		return () => stopTelemetrySimulator();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Meridian WMS — Demo</title>
</svelte:head>

{#if !hideDevNav}
	<DevNav />
{/if}
<div class="demo-root" class:screenshot-mode={hideDevNav}>
	{@render children()}
</div>
