<script lang="ts">
	let {
		siteLabel,
		periodLabel,
		lastRefreshed,
		shiftLabel
	}: {
		siteLabel: string;
		periodLabel: string;
		lastRefreshed: string;
		shiftLabel?: string;
	} = $props();
</script>

<header class="dashboard-chrome">
	<div class="left">
		<div class="logo" aria-hidden="true"></div>
		<span class="wordmark mono">
			<span class="brand">MERIDIAN</span><span class="suffix">/OPS</span>
		</span>
		<button type="button" class="site-badge mono">{siteLabel} ▾</button>
	</div>
	<div class="center mono">
		{#if shiftLabel}
			<span>{shiftLabel}</span>
			<span class="dot">·</span>
		{/if}
		<span>Week of Jul 1</span>
		<span class="dot">·</span>
		<span>Last refreshed {lastRefreshed}</span>
	</div>
	<div class="right">
		<label class="period mono">
			<span class="label">Period</span>
			<select>
				<option selected>{periodLabel}</option>
				<option>MTD</option>
				<option>30d</option>
			</select>
		</label>
	</div>
</header>

<style>
	.dashboard-chrome {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 16px;
		padding: 12px 20px;
		background: var(--surface-panel);
		border-bottom: 1px solid var(--hairline);
	}

	.left,
	.right {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.right {
		justify-content: flex-end;
	}

	.logo {
		width: 15px;
		height: 15px;
		background: var(--green);
		flex-shrink: 0;
	}

	.wordmark {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
	}

	.brand {
		color: var(--text-primary);
	}

	.suffix {
		color: var(--text-muted);
	}

	.site-badge {
		padding: 3px 7px;
		border: 1px solid var(--badge-border);
		border-radius: var(--radius-md);
		background: white;
		font-size: 10px;
		font-weight: 500;
		color: var(--text-muted);
		cursor: pointer;
	}

	.center {
		font-size: 10px;
		color: var(--text-muted);
		text-align: center;
		white-space: nowrap;
	}

	.dot {
		margin: 0 6px;
		opacity: 0.5;
	}

	.period {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.period select {
		padding: 4px 8px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-lg);
		background: white;
		font-size: 10px;
		font-weight: 500;
		color: var(--text-secondary);
	}

	@media (max-width: 900px) {
		.dashboard-chrome {
			grid-template-columns: 1fr;
		}

		.center {
			order: 3;
		}
	}
</style>
