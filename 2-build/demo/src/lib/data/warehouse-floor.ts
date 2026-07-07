export type StockSignal = 'ok' | 'low' | 'blocked' | 'replenish';

export type FloorZone = {
	id: string;
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
	congestion: number;
	pickers: number;
	stock: StockSignal;
	lowStockBins: number;
	blockedBins: number;
};

export type FloorFeature = {
	id: string;
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
	kind: 'dock' | 'pack' | 'staging' | 'aisle';
};

export type FloorPicker = {
	id: string;
	zoneId: string;
	x: number;
	y: number;
};

export type WarehouseFloorData = {
	zones: FloorZone[];
	features: FloorFeature[];
	pickers: FloorPicker[];
	hotZoneId: string;
};

const FLOOR_FEATURES: FloorFeature[] = [
	{ id: 'dock', label: 'Dock', x: 168, y: 6, width: 184, height: 22, kind: 'dock' },
	{ id: 'aisle-v', label: 'Main aisle', x: 156, y: 34, width: 28, height: 132, kind: 'aisle' },
	{ id: 'aisle-h', label: 'Cross aisle', x: 16, y: 98, width: 328, height: 18, kind: 'aisle' },
	{ id: 'pack', label: 'Pack', x: 360, y: 34, width: 144, height: 132, kind: 'pack' },
	{ id: 'staging', label: 'Staging', x: 16, y: 170, width: 488, height: 20, kind: 'staging' }
];

const ZONE_LAYOUT: Omit<FloorZone, 'congestion' | 'pickers' | 'stock' | 'lowStockBins' | 'blockedBins'>[] =
	[
		{ id: 'zone-a', label: 'Zone A', x: 16, y: 34, width: 136, height: 60 },
		{ id: 'zone-b', label: 'Zone B', x: 188, y: 34, width: 136, height: 60 },
		{ id: 'zone-c', label: 'Zone C', x: 16, y: 120, width: 136, height: 46 },
		{ id: 'zone-d', label: 'Zone D', x: 188, y: 120, width: 136, height: 46 }
	];

function buildFloor(
	zoneData: Record<
		string,
		Pick<FloorZone, 'congestion' | 'pickers' | 'stock' | 'lowStockBins' | 'blockedBins'>
	>,
	pickers: FloorPicker[],
	hotZoneId: string
): WarehouseFloorData {
	return {
		zones: ZONE_LAYOUT.map((zone) => ({ ...zone, ...zoneData[zone.id] })),
		features: FLOOR_FEATURES,
		pickers,
		hotZoneId
	};
}

export const WAREHOUSE_FLOOR_HAPPY = buildFloor(
	{
		'zone-a': { congestion: 0.14, pickers: 1, stock: 'ok', lowStockBins: 0, blockedBins: 0 },
		'zone-b': { congestion: 0.28, pickers: 1, stock: 'low', lowStockBins: 1, blockedBins: 0 },
		'zone-c': { congestion: 0.74, pickers: 2, stock: 'low', lowStockBins: 2, blockedBins: 0 },
		'zone-d': { congestion: 0.16, pickers: 1, stock: 'ok', lowStockBins: 0, blockedBins: 0 }
	},
	[
		{ id: 'p1', zoneId: 'zone-a', x: 52, y: 58 },
		{ id: 'p2', zoneId: 'zone-b', x: 224, y: 54 },
		{ id: 'p3', zoneId: 'zone-c', x: 68, y: 138 },
		{ id: 'p4', zoneId: 'zone-c', x: 96, y: 148 },
		{ id: 'p5', zoneId: 'zone-d', x: 248, y: 142 }
	],
	'zone-c'
);

export const WAREHOUSE_FLOOR_ALERT = buildFloor(
	{
		'zone-a': { congestion: 0.38, pickers: 1, stock: 'blocked', lowStockBins: 1, blockedBins: 1 },
		'zone-b': { congestion: 0.58, pickers: 2, stock: 'replenish', lowStockBins: 2, blockedBins: 0 },
		'zone-c': { congestion: 0.94, pickers: 4, stock: 'blocked', lowStockBins: 3, blockedBins: 2 },
		'zone-d': { congestion: 0.46, pickers: 2, stock: 'low', lowStockBins: 1, blockedBins: 0 }
	},
	[
		{ id: 'p1', zoneId: 'zone-a', x: 48, y: 56 },
		{ id: 'p2', zoneId: 'zone-b', x: 212, y: 52 },
		{ id: 'p3', zoneId: 'zone-b', x: 268, y: 64 },
		{ id: 'p4', zoneId: 'zone-c', x: 58, y: 136 },
		{ id: 'p5', zoneId: 'zone-c', x: 88, y: 148 },
		{ id: 'p6', zoneId: 'zone-c', x: 112, y: 132 },
		{ id: 'p7', zoneId: 'zone-c', x: 128, y: 150 },
		{ id: 'p8', zoneId: 'zone-d', x: 236, y: 140 },
		{ id: 'p9', zoneId: 'zone-d', x: 280, y: 148 }
	],
	'zone-c'
);

export const PICK_SELF_POSITION = { x: 120, y: 176 };

const LOCATION_PINS: Record<string, { x: number; y: number; zoneId: string }> = {
	'A-08-02': { x: 44, y: 48, zoneId: 'zone-a' },
	'A-10-02': { x: 58, y: 54, zoneId: 'zone-a' },
	'A-12-03': { x: 68, y: 52, zoneId: 'zone-a' },
	'A-14-01': { x: 96, y: 56, zoneId: 'zone-a' },
	'A-20-01': { x: 120, y: 50, zoneId: 'zone-a' },
	'B-06-04': { x: 212, y: 48, zoneId: 'zone-b' },
	'B-12-01': { x: 248, y: 52, zoneId: 'zone-b' },
	'B-18-02': { x: 278, y: 58, zoneId: 'zone-b' },
	'Reserve B-14': { x: 252, y: 50, zoneId: 'zone-b' },
	'C-04-02': { x: 48, y: 132, zoneId: 'zone-c' },
	'C-09-03': { x: 108, y: 148, zoneId: 'zone-c' },
	'D-05-02': { x: 210, y: 148, zoneId: 'zone-d' },
	'D-11-01': { x: 236, y: 136, zoneId: 'zone-d' }
};

export function zoneIdFromLocation(location: string): string {
	const letter = location.trim().charAt(0).toUpperCase();
	switch (letter) {
		case 'A':
			return 'zone-a';
		case 'B':
			return 'zone-b';
		case 'C':
			return 'zone-c';
		case 'D':
			return 'zone-d';
		default:
			return 'zone-a';
	}
}

export function pinForLocation(location: string): { x: number; y: number; zoneId: string } {
	return (
		LOCATION_PINS[location] ?? {
			x: 84,
			y: 54,
			zoneId: zoneIdFromLocation(location)
		}
	);
}

export function zoneLabelFromId(zoneId: string): string {
	return ZONE_LAYOUT.find((zone) => zone.id === zoneId)?.label ?? 'Zone A';
}

export function routePathForPick(
	from: { x: number; y: number },
	to: { x: number; y: number },
	avoidHotZone: boolean
): string {
	const fromZone = zoneIdFromPin(from);
	const toZone = zoneIdFromPin(to);

	if (fromZone === toZone) {
		return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
	}

	if (avoidHotZone) {
		return `M ${from.x} ${from.y} L 170 ${from.y} L 170 54 L ${to.x} ${to.y}`;
	}

	// Cross through the horizontal aisle unless routing around congestion.
	return `M ${from.x} ${from.y} L ${from.x} 108 L ${to.x} 108 L ${to.x} ${to.y}`;
}

function zoneIdFromPin(point: { x: number; y: number }): string {
	for (const zone of ZONE_LAYOUT) {
		if (
			point.x >= zone.x &&
			point.x <= zone.x + zone.width &&
			point.y >= zone.y &&
			point.y <= zone.y + zone.height
		) {
			return zone.id;
		}
	}
	return 'staging';
}
