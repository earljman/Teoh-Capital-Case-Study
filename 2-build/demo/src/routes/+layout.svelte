<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import DevNav from '$lib/components/DevNav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Meridian WMS — Demo</title>
</svelte:head>

<DevNav />
{@render children()}
