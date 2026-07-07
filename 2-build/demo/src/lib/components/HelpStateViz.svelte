<script lang="ts">
	import type { HelpStateViz } from '$lib/data/help-content';

	let { viz }: { viz: HelpStateViz } = $props();

	const toneColor = {
		good: 'var(--green)',
		warn: 'var(--amber)',
		critical: 'var(--red)',
		neutral: 'var(--text-muted)'
	} as const;

	const toneBg = {
		good: 'var(--green-tint)',
		warn: 'var(--amber-tint)',
		critical: 'var(--red-tint)',
		neutral: 'var(--surface-panel)'
	} as const;

	const heatCells = [0.1, 0.15, 0.2, 0.35, 0.55, 0.85, 0.7, 0.4, 0.25, 0.18, 0.12, 0.1];

	function heatColor(v: number) {
		return `rgba(${160 + v * 40}, ${160 - v * 130}, ${120 - v * 100}, ${0.12 + v * 0.85})`;
	}
</script>

<figure class="state-viz">
	{#if viz.heading}
		<figcaption class="viz-heading">{viz.heading}</figcaption>
	{/if}

	{#if viz.kind === 'compare'}
		<div class="compare-row">
			{#each viz.items as item (item.label)}
				<div class="state-card" style:--tone={toneColor[item.tone]} style:--tone-bg={toneBg[item.tone]}>
					{#if item.preview}
						<p class="preview mono">{item.preview}</p>
					{/if}
					<p class="state-label">{item.label}</p>
					<p class="state-caption">{item.caption}</p>
				</div>
			{/each}
		</div>
	{:else if viz.kind === 'timeline'}
		<div class="timeline-row" role="img" aria-label={viz.heading ?? 'State timeline'}>
			{#each viz.items as item, i (item.label)}
				<div class="timeline-item">
					<span class="dot" style:background={toneColor[item.tone]}></span>
					<span class="timeline-label">{item.label}</span>
					{#if i === 0 || i === viz.items.length - 1}
						<span class="timeline-edge mono">{i === 0 ? 'Mon' : 'Sun'}</span>
					{/if}
				</div>
			{/each}
		</div>
	{:else if viz.kind === 'split'}
		<div class="split-wrap">
			<div class="split-bar" role="img" aria-label="Override split">
				{#each viz.segments as seg (seg.label)}
					<div
						class="split-seg"
						style:width="{seg.pct}%"
						style:background={toneColor[seg.tone]}
					></div>
				{/each}
			</div>
			<div class="split-legend">
				{#each viz.segments as seg (seg.label)}
					<span class="legend-item">
						<span class="swatch" style:background={toneColor[seg.tone]}></span>
						{seg.label} · {seg.pct}%
					</span>
				{/each}
			</div>
		</div>
	{:else if viz.kind === 'gauge-compare'}
		<div class="gauge-row">
			{#each viz.items as item (item.label)}
				<div class="gauge-card">
					<p class="gauge-label">{item.label}</p>
					<p class="gauge-value mono" class:warn={item.value < item.threshold}>
						{item.value}%
					</p>
					<div class="gauge-track">
						<div
							class="gauge-fill"
							style:width="{item.value}%"
							style:background={item.value < item.threshold ? toneColor.warn : toneColor.good}
						></div>
						<div class="gauge-threshold" style:left="{item.threshold}%"></div>
					</div>
					<p class="gauge-note mono">{item.threshold}% target</p>
				</div>
			{/each}
		</div>
	{:else if viz.kind === 'heatmap'}
		<div class="heatmap-wrap">
			<div class="heatmap-grid" role="img" aria-label="Congestion heatmap sample">
				{#each heatCells as v, i (i)}
					<span class="heat-cell" style:background={heatColor(v)}></span>
				{/each}
			</div>
			{#if viz.caption}
				<p class="heatmap-caption">{viz.caption}</p>
			{/if}
		</div>
	{:else if viz.kind === 'progress-compare'}
		<div class="progress-row">
			{#each viz.items as item (item.label)}
				<div class="progress-card">
					<p class="progress-label">{item.label}</p>
					<div class="ring" aria-hidden="true">
						<svg viewBox="0 0 100 100">
							<circle cx="50" cy="50" r="42" class="track" />
							<circle
								cx="50"
								cy="50"
								r="42"
								class="fill"
								stroke-dasharray="{(item.current / item.total) * 264} 264"
							/>
						</svg>
						<span class="ring-label mono">{item.current}/{item.total}</span>
					</div>
					{#if item.note}
						<p class="progress-note mono">{item.note}</p>
					{/if}
				</div>
			{/each}
		</div>
	{:else if viz.kind === 'status-cards'}
		<div class="compare-row">
			{#each viz.items as item (item.title)}
				<div class="status-card" style:--tone={toneColor[item.tone]} style:--tone-bg={toneBg[item.tone]}>
					<p class="status-title">{item.title}</p>
					<p class="status-body">{item.body}</p>
				</div>
			{/each}
		</div>
	{:else if viz.kind === 'pills'}
		<div class="pill-row">
			{#each viz.items as item (item.label)}
				<span
					class="pill"
					style:color={toneColor[item.tone]}
					style:background={toneBg[item.tone]}
				>
					{item.label}
				</span>
			{/each}
		</div>
	{:else if viz.kind === 'workflow'}
		<div class="workflow-row">
			{#each viz.steps as step, i (step.label)}
				<div class="workflow-step">
					<span
						class="step-dot"
						style:background={step.tone ? toneColor[step.tone] : 'var(--green)'}
					></span>
					<span class="step-label">{step.label}</span>
				</div>
				{#if i < viz.steps.length - 1}
					<span class="workflow-arrow" aria-hidden="true">→</span>
				{/if}
			{/each}
		</div>
	{:else if viz.kind === 'log-samples'}
		<div class="log-samples">
			{#each viz.rows as row (row.time + row.type)}
				<div class="log-row">
					<span class="log-time mono">{row.time}</span>
					<span class="log-type" style:color={toneColor[row.tone]}>{row.type}</span>
					<span class="log-msg">{row.message}</span>
				</div>
			{/each}
		</div>
	{:else if viz.kind === 'bars'}
		<div class="bars-row">
			{#each viz.items as item (item.label)}
				<div class="bar-card">
					<p class="bar-label">{item.label}</p>
					<div class="bar-track">
						<div
							class="bar-fill"
							style:width="{item.pct}%"
							style:background={toneColor[item.tone]}
						></div>
					</div>
					<p class="bar-caption mono">{item.caption}</p>
				</div>
			{/each}
		</div>
	{/if}
</figure>

<style>
	.state-viz {
		margin: 0;
		padding: 12px;
		border: 1px solid var(--separator);
		border-radius: var(--radius-md);
		background: white;
	}

	.viz-heading {
		margin: 0 0 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.compare-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 8px;
	}

	.state-card,
	.status-card {
		padding: 10px;
		border: 1px solid var(--separator);
		border-left: 2px solid var(--tone);
		border-radius: var(--radius-md);
		background: var(--tone-bg);
	}

	.preview {
		margin: 0 0 6px;
		font-size: 15px;
		font-weight: 600;
		color: var(--tone);
	}

	.state-label,
	.status-title {
		margin: 0 0 4px;
		font-size: 12px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.state-caption,
	.status-body {
		margin: 0;
		font-size: 11px;
		line-height: 1.45;
		color: var(--text-secondary);
	}

	.timeline-row {
		display: flex;
		gap: 6px;
	}

	.timeline-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.timeline-label {
		font-size: 10px;
		color: var(--text-muted);
		text-align: center;
	}

	.timeline-edge {
		font-size: 8px;
		color: var(--text-faint);
	}

	.split-wrap {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.split-bar {
		display: flex;
		height: 8px;
		border-radius: 999px;
		overflow: hidden;
		background: var(--separator);
	}

	.split-seg {
		height: 100%;
	}

	.split-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		font-size: 10px;
		color: var(--text-muted);
	}

	.legend-item {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.swatch {
		width: 8px;
		height: 8px;
		border-radius: 2px;
	}

	.gauge-row,
	.progress-row,
	.bars-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: 10px;
	}

	.gauge-label,
	.progress-label,
	.bar-label {
		margin: 0 0 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.gauge-value {
		margin: 0 0 6px;
		font-size: 16px;
		font-weight: 600;
		color: var(--green);
	}

	.gauge-value.warn {
		color: var(--amber);
	}

	.gauge-track {
		position: relative;
		height: 6px;
		border-radius: 999px;
		background: var(--separator);
	}

	.gauge-fill {
		height: 100%;
		border-radius: 999px;
	}

	.gauge-threshold {
		position: absolute;
		top: -2px;
		width: 2px;
		height: 10px;
		background: var(--text-faint);
		transform: translateX(-50%);
	}

	.gauge-note {
		margin: 4px 0 0;
		font-size: 9px;
		color: var(--text-faint);
	}

	.heatmap-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 3px;
	}

	.heat-cell {
		height: 14px;
		border-radius: 2px;
	}

	.heatmap-caption {
		margin: 8px 0 0;
		font-size: 11px;
		color: var(--text-muted);
	}

	.progress-card {
		text-align: center;
	}

	.ring {
		position: relative;
		width: 72px;
		height: 72px;
		margin: 0 auto;
	}

	.ring svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}

	.track {
		fill: none;
		stroke: var(--separator);
		stroke-width: 8;
	}

	.fill {
		fill: none;
		stroke: var(--green);
		stroke-width: 8;
		stroke-linecap: round;
	}

	.ring-label {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		font-weight: 600;
	}

	.progress-note {
		margin: 6px 0 0;
		font-size: 9px;
		color: var(--text-faint);
	}

	.pill-row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.pill {
		padding: 4px 8px;
		border-radius: var(--radius-md);
		font-size: 10px;
		font-weight: 600;
	}

	.workflow-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}

	.workflow-step {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 8px;
		border: 1px solid var(--separator);
		border-radius: var(--radius-md);
		background: var(--surface-panel);
		font-size: 11px;
		color: var(--text-secondary);
	}

	.step-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.workflow-arrow {
		color: var(--text-faint);
		font-size: 12px;
	}

	.log-samples {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.log-row {
		display: grid;
		grid-template-columns: 36px 72px 1fr;
		gap: 8px;
		padding: 7px 0;
		border-bottom: 1px solid var(--separator);
		font-size: 10px;
		align-items: baseline;
	}

	.log-row:last-child {
		border-bottom: none;
	}

	.log-time {
		color: var(--text-faint);
	}

	.log-type {
		font-weight: 600;
	}

	.log-msg {
		color: var(--text-secondary);
	}

	.bar-track {
		height: 8px;
		border-radius: 999px;
		background: var(--separator);
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 999px;
	}

	.bar-caption {
		margin: 4px 0 0;
		font-size: 9px;
		color: var(--text-faint);
	}
</style>
