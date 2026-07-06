<script lang="ts">
	let {
		children,
		variant = 'desktop'
	}: {
		children: import('svelte').Snippet;
		variant?: 'desktop' | 'mobile';
	} = $props();
</script>

<div class="viewport" class:mobile={variant === 'mobile'}>
	{@render children()}
</div>

<style>
	.viewport {
		max-width: var(--viewport-desktop);
		margin: 0 auto;
		min-height: calc(100vh - 42px);
		background: var(--surface-base);
		border-left: 1px solid var(--hairline);
		border-right: 1px solid var(--hairline);
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.02);
	}

	.viewport.mobile {
		max-width: var(--viewport-mobile);
		min-height: 780px;
		margin-top: 24px;
		margin-bottom: 24px;
		border-radius: 24px;
		overflow: hidden;
		border: 8px solid #1a1a1a;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
	}
</style>
