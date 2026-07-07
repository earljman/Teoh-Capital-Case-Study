<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import DevNav from '$lib/components/DevNav.svelte';
	import { isScreenshotMode } from '$lib/demo/href';

	let { children } = $props();

	const hideDevNav = $derived(isScreenshotMode(page.url.searchParams));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Meridian WMS — Demo</title>
</svelte:head>

{#if !hideDevNav}
	<DevNav />
{/if}
{@render children()}
