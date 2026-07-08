<script lang="ts">
	import type { FloorZone, WarehouseFloorData } from '$lib/data/warehouse-floor';

	type Pin = { x: number; y: number; label: string };

	let {
		floor,
		layer = 'congestion',
		variant = 'supervisor',
		width = 520,
		height = 196,
		activeZoneId,
		targetPin,
		selfPosition,
		routePath,
		routeLabel
	}: {
		floor: WarehouseFloorData;
		layer?: 'congestion' | 'stock';
		variant?: 'supervisor' | 'picker';
		width?: number;
		height?: number;
		activeZoneId?: string;
		targetPin?: Pin;
		selfPosition?: { x: number; y: number };
		routePath?: string;
		routeLabel?: string;
	} = $props();

	const isPicker = $derived(variant === 'picker');
	const viewWidth = 520;
	const viewHeight = 196;

	let hoveredZone = $state<FloorZone | null>(null);
	let phase = $state(0);

	function routeDraw(node: SVGPathElement) {
		const apply = () => {
			const len = node.getTotalLength();
			node.style.strokeDasharray = `${len}`;
			node.style.strokeDashoffset = `${len}`;
			node.classList.remove('route-draw');
			void node.getBoundingClientRect();
			node.classList.add('route-draw');
		};
		apply();
		return { update: apply };
	}

	$effect(() => {
		const id = setInterval(() => {
			phase += 1;
		}, 140);
		return () => clearInterval(id);
	});

	function congestionFill(score: number, hot: boolean): string {
		const pulse = hot ? 0.06 * Math.sin(phase * 0.1) : 0;
		const v = Math.min(1, score + pulse);
		if (v < 0.35) return `rgba(31, 122, 77, ${0.08 + v * 0.22})`;
		if (v < 0.65) return `rgba(160, 110, 8, ${0.14 + v * 0.38})`;
		return `rgba(179, 53, 43, ${0.18 + v * 0.5})`;
	}

	function stockFill(signal: FloorZone['stock']): string {
		switch (signal) {
			case 'blocked':
				return 'rgba(179, 53, 43, 0.28)';
			case 'replenish':
				return 'rgba(160, 110, 8, 0.22)';
			case 'low':
				return 'rgba(160, 110, 8, 0.14)';
			default:
				return 'rgba(31, 122, 77, 0.06)';
		}
	}

	function stockStroke(signal: FloorZone['stock']): string {
		switch (signal) {
			case 'blocked':
				return 'var(--red)';
			case 'replenish':
			case 'low':
				return 'var(--amber)';
			default:
				return 'var(--green-outline)';
		}
	}

	function rackLines(zone: FloorZone): { x: number; y: number; w: number; h: number }[] {
		const lines: { x: number; y: number; w: number; h: number }[] = [];
		const count = zone.width > 120 ? 5 : 4;
		const gap = zone.width / (count + 1);
		for (let i = 1; i <= count; i++) {
			lines.push({
				x: zone.x + gap * i - 3,
				y: zone.y + 8,
				w: 6,
				h: zone.height - 16
			});
		}
		return lines;
	}

	function zoneHandlers(zone: FloorZone) {
		if (isPicker) return {};
		return {
			onmouseenter: () => (hoveredZone = zone),
			onmouseleave: () => (hoveredZone = null),
			onfocus: () => (hoveredZone = zone),
			onblur: () => (hoveredZone = null)
		};
	}
</script>

<div class="floor-map" class:picker={isPicker}>
	<svg
		{width}
		{height}
		viewBox="0 0 {viewWidth} {viewHeight}"
		role="img"
		aria-label={isPicker
			? `Pick route to ${targetPin?.label ?? 'next bin'}`
			: `Warehouse floor map with ${layer} overlay`}
	>
		<rect x="0" y="0" width={viewWidth} height={viewHeight} class="canvas" rx="4" />

		{#each floor.features as feature (feature.id)}
			<g class="feature" data-kind={feature.kind}>
				<rect
					x={feature.x}
					y={feature.y}
					width={feature.width}
					height={feature.height}
					rx="3"
					class="feature-shape"
				/>
				{#if !isPicker || feature.kind === 'dock' || feature.kind === 'pack'}
					<text
						x={feature.x + feature.width / 2}
						y={feature.y + feature.height / 2 + 3}
						text-anchor="middle"
						class="feature-label mono"
					>
						{feature.label}
					</text>
				{/if}
			</g>
		{/each}

		{#each floor.zones as zone (zone.id)}
			{@const hot = zone.id === floor.hotZoneId}
			{@const active = zone.id === activeZoneId}
			{@const overlayFill =
				isPicker || layer === 'congestion'
					? congestionFill(zone.congestion, hot)
					: stockFill(zone.stock)}
			{#if isPicker}
				<g class="zone" class:hot class:active>
					<rect
						x={zone.x}
						y={zone.y}
						width={zone.width}
						height={zone.height}
						rx="3"
						class="zone-base"
					/>
					<rect
						x={zone.x}
						y={zone.y}
						width={zone.width}
						height={zone.height}
						rx="3"
						class="zone-overlay"
						fill={overlayFill}
					/>
					{#each rackLines(zone) as rack, i (i)}
						<rect x={rack.x} y={rack.y} width={rack.w} height={rack.h} class="rack" rx="1" />
					{/each}
				</g>
			{:else}
				<g
					class="zone"
					class:hot
					class:active
					role="button"
					tabindex="0"
					{...zoneHandlers(zone)}
				>
					<rect
						x={zone.x}
						y={zone.y}
						width={zone.width}
						height={zone.height}
						rx="3"
						class="zone-base"
						stroke={layer === 'stock' ? stockStroke(zone.stock) : 'var(--separator)'}
					/>
					<rect
						x={zone.x}
						y={zone.y}
						width={zone.width}
						height={zone.height}
						rx="3"
						class="zone-overlay"
						fill={overlayFill}
					/>
					{#each rackLines(zone) as rack, i (i)}
						<rect x={rack.x} y={rack.y} width={rack.w} height={rack.h} class="rack" rx="1" />
					{/each}
					<text x={zone.x + 8} y={zone.y + 14} class="zone-label mono">{zone.label}</text>
					{#if layer === 'stock' && zone.stock !== 'ok'}
						<g class="stock-badge" transform="translate({zone.x + zone.width - 22}, {zone.y + 6})">
							<rect width="18" height="14" rx="2" class="badge-bg" />
							<text x="9" y="10" text-anchor="middle" class="badge-text mono">
								{zone.blockedBins > 0 ? zone.blockedBins : zone.lowStockBins}
							</text>
						</g>
					{/if}
				</g>
			{/if}
		{/each}

		{#if routePath}
			{#key routePath}
				<path d={routePath} class="route" use:routeDraw />
			{/key}
		{/if}

		{#if !isPicker && layer === 'congestion'}
			{#each floor.pickers as picker (picker.id)}
				{@const shimmer = 0.85 + 0.15 * Math.sin(phase * 0.12 + picker.x)}
				<circle
					cx={picker.x}
					cy={picker.y}
					r={3.2 * shimmer}
					class="picker"
					opacity={shimmer}
				/>
			{/each}
		{/if}

		{#if selfPosition}
			<circle cx={selfPosition.x} cy={selfPosition.y} r="4.5" class="self-marker" />
			{#if isPicker}
				<text x={selfPosition.x + 8} y={selfPosition.y + 3} class="marker-label mono">You</text>
			{/if}
		{/if}

		{#if targetPin}
			{@const pulse = 5 + Math.sin(phase * 0.14) * 1.5}
			<circle cx={targetPin.x} cy={targetPin.y} r={pulse} class="target-ring" />
			<circle cx={targetPin.x} cy={targetPin.y} r="4.5" class="target-pin" />
			{#if isPicker}
				<text x={targetPin.x + 8} y={targetPin.y + 3} class="marker-label mono target-label">
					{targetPin.label}
				</text>
			{/if}
		{/if}
	</svg>

	{#if hoveredZone && !isPicker}
		<div class="tooltip mono" role="tooltip">
			<p class="tooltip-title">{hoveredZone.label}</p>
			<p>Congestion {Math.round(hoveredZone.congestion * 100)}% · {hoveredZone.pickers} pickers</p>
			{#if hoveredZone.lowStockBins > 0 || hoveredZone.blockedBins > 0}
				<p>
					{hoveredZone.lowStockBins} low · {hoveredZone.blockedBins} blocked
				</p>
			{/if}
		</div>
	{/if}

	{#if isPicker && routeLabel}
		<p class="route-caption mono">{routeLabel}</p>
	{/if}

	<div class="legend mono" aria-hidden="true">
		{#if isPicker}
			<span><i class="picker-dot self"></i> You</span>
			<span><i class="target-dot"></i> Next pick</span>
			<span><i class="route-key"></i> Route</span>
			<span><i class="swatch high"></i> Avoid</span>
		{:else if layer === 'congestion'}
			<span><i class="swatch low"></i> Clear</span>
			<span><i class="swatch mid"></i> Moderate</span>
			<span><i class="swatch high"></i> Bottleneck</span>
			<span class="picker-key"><i class="picker-dot"></i> Picker</span>
		{:else}
			<span><i class="swatch stock-ok"></i> Nominal</span>
			<span><i class="swatch stock-low"></i> Low stock</span>
			<span><i class="swatch stock-blocked"></i> Blocked</span>
		{/if}
	</div>
</div>

<style>
	.floor-map {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.floor-map.picker {
		gap: 4px;
	}

	.canvas {
		fill: #f3f5f3;
		stroke: var(--separator);
	}

	.feature-shape {
		fill: #e8ebe8;
		stroke: var(--hairline);
	}

	.feature[data-kind='dock'] .feature-shape {
		fill: #dfe5e1;
	}

	.feature[data-kind='pack'] .feature-shape {
		fill: #e4ebe6;
	}

	.feature[data-kind='aisle'] .feature-shape {
		fill: #f8faf8;
		stroke-dasharray: 3 2;
	}

	.feature[data-kind='staging'] .feature-shape {
		fill: #ecefec;
	}

	.feature-label {
		font-size: 8px;
		fill: var(--text-faint);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		pointer-events: none;
	}

	.zone {
		cursor: default;
	}

	.zone-base {
		fill: #fafbfa;
		stroke-width: 1;
	}

	.zone.hot .zone-base {
		stroke: color-mix(in oklab, var(--red) 35%, var(--separator));
	}

	.zone.active .zone-base {
		stroke: var(--green);
		stroke-width: 1.5;
	}

	.zone-overlay {
		pointer-events: none;
	}

	.rack {
		fill: #d5dad6;
		opacity: 0.85;
		pointer-events: none;
	}

	.zone-label {
		font-size: 9px;
		font-weight: 600;
		fill: var(--text-secondary);
		pointer-events: none;
	}

	.badge-bg {
		fill: white;
		stroke: var(--amber);
	}

	.badge-text {
		font-size: 8px;
		font-weight: 600;
		fill: var(--amber);
	}

	.route {
		fill: none;
		stroke: var(--green);
		stroke-width: 2;
		stroke-dasharray: 5 3;
		stroke-linecap: round;
		stroke-linejoin: round;
		pointer-events: none;
	}

	.picker {
		fill: var(--green);
		stroke: white;
		stroke-width: 1;
	}

	.self-marker {
		fill: #2d5f45;
		stroke: white;
		stroke-width: 1.5;
	}

	.target-pin {
		fill: var(--green);
		stroke: white;
		stroke-width: 1.5;
	}

	.target-ring {
		fill: none;
		stroke: var(--green);
		stroke-width: 1;
		opacity: 0.45;
		pointer-events: none;
	}

	.marker-label {
		font-size: 8px;
		font-weight: 600;
		fill: var(--text-secondary);
		pointer-events: none;
	}

	.target-label {
		fill: var(--green);
	}

	.tooltip {
		position: absolute;
		top: 8px;
		right: 8px;
		padding: 8px 10px;
		border: 1px solid var(--separator);
		border-radius: var(--radius-md);
		background: white;
		box-shadow: 0 4px 16px rgba(20, 25, 23, 0.08);
		font-size: 9px;
		color: var(--text-muted);
		pointer-events: none;
	}

	.tooltip-title {
		margin: 0 0 2px;
		font-size: 10px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.tooltip p {
		margin: 0;
	}

	.route-caption {
		margin: 0;
		font-size: 10px;
		color: var(--text-muted);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		font-size: 8px;
		color: var(--text-faint);
		letter-spacing: 0.03em;
	}

	.picker .legend {
		gap: 8px;
		font-size: 7px;
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.swatch {
		display: inline-block;
		width: 10px;
		height: 6px;
		border-radius: 1px;
	}

	.swatch.low {
		background: rgba(31, 122, 77, 0.25);
	}

	.swatch.mid {
		background: rgba(160, 110, 8, 0.35);
	}

	.swatch.high {
		background: rgba(179, 53, 43, 0.45);
	}

	.swatch.stock-ok {
		background: rgba(31, 122, 77, 0.15);
	}

	.swatch.stock-low {
		background: rgba(160, 110, 8, 0.3);
	}

	.swatch.stock-blocked {
		background: rgba(179, 53, 43, 0.35);
	}

	.picker-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--green);
		border: 1px solid white;
	}

	.picker-dot.self {
		background: #2d5f45;
	}

	.target-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--green);
		box-shadow: 0 0 0 2px white, 0 0 0 3px var(--green-outline);
	}

	.route-key {
		display: inline-block;
		width: 12px;
		height: 0;
		border-top: 2px dashed var(--green);
	}

	.picker-key {
		margin-left: auto;
	}
</style>
