export type BatchPick = {
	location: string;
	sku: string;
	description: string;
	qty: number;
	toteSlot: string;
	routeM: number;
	avoidHotZone?: boolean;
};

export type PickTask = BatchPick & {
	batchProgress: { current: number; total: number };
	walkSavedM: number;
};

export const PICK_BATCH_TOTAL = 12;

export const PICK_BATCH: BatchPick[] = [
	{ location: 'A-08-02', sku: 'SKU-22104', description: 'LEGO City Fire Truck', qty: 1, toteSlot: 'Tote 3', routeM: 38 },
	{ location: 'A-14-01', sku: 'SKU-33118', description: 'Barbie Dreamhouse', qty: 1, toteSlot: 'Tote 3', routeM: 22 },
	{ location: 'B-06-04', sku: 'SKU-90211', description: 'Nintendo Switch Game', qty: 2, toteSlot: 'Tote 3', routeM: 54 },
	{ location: 'A-10-02', sku: 'SKU-11045', description: 'Hot Wheels Track Set', qty: 3, toteSlot: 'Tote 3', routeM: 28 },
	{ location: 'A-12-03', sku: 'SKU-44821', description: 'Hasbro Nerf Elite 2.0', qty: 2, toteSlot: 'Tote 3', routeM: 18 },
	{
		location: 'C-04-02',
		sku: 'SKU-55902',
		description: 'Fisher-Price Walker',
		qty: 1,
		toteSlot: 'Tote 3',
		routeM: 62,
		avoidHotZone: true
	},
	{ location: 'D-11-01', sku: 'SKU-77201', description: 'Monopoly Classic', qty: 2, toteSlot: 'Tote 3', routeM: 34 },
	{ location: 'B-18-02', sku: 'SKU-66140', description: 'Play-Doh Mega Pack', qty: 4, toteSlot: 'Tote 3', routeM: 58 },
	{ location: 'A-20-01', sku: 'SKU-11882', description: 'Tonka Dump Truck', qty: 1, toteSlot: 'Tote 3', routeM: 46 },
	{
		location: 'C-09-03',
		sku: 'SKU-33901',
		description: 'Melissa & Doug Puzzle',
		qty: 2,
		toteSlot: 'Tote 3',
		routeM: 52,
		avoidHotZone: true
	},
	{ location: 'D-05-02', sku: 'SKU-88410', description: 'UNO Card Game', qty: 6, toteSlot: 'Tote 3', routeM: 24 },
	{ location: 'B-12-01', sku: 'SKU-99221', description: 'Crayola Art Kit', qty: 1, toteSlot: 'Tote 3', routeM: 44 }
];

/** Index of the next pick in `PICK_BATCH` (also = completed count). */
export const PICK_BATCH_START = 4;

export function pickAt(index: number): BatchPick {
	return PICK_BATCH[Math.min(index, PICK_BATCH.length - 1)];
}

export function pickTaskAt(index: number, walkSavedM = 800): PickTask {
	const pick = pickAt(index);
	return {
		...pick,
		batchProgress: { current: index, total: PICK_BATCH_TOTAL },
		walkSavedM
	};
}

export const PICK_TASK: PickTask = pickTaskAt(PICK_BATCH_START);

export const PICK_REROUTE: BatchPick = {
	location: 'Reserve B-14',
	sku: 'SKU-44821',
	description: 'Hasbro Nerf Elite 2.0',
	qty: 2,
	toteSlot: 'Tote 3',
	routeM: 68,
	avoidHotZone: true
};
