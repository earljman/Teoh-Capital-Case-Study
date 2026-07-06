export type PickTask = {
	location: string;
	sku: string;
	description: string;
	qty: number;
	toteSlot: string;
	batchProgress: { current: number; total: number };
	walkSavedM: number;
};

export const PICK_TASK: PickTask = {
	location: 'A-12-03',
	sku: 'SKU-44821',
	description: 'Hasbro Nerf Elite 2.0',
	qty: 2,
	toteSlot: 'Tote 3',
	batchProgress: { current: 4, total: 12 },
	walkSavedM: 800
};

export const PICK_REROUTE = {
	location: 'Reserve B-14',
	sku: 'SKU-44821',
	description: 'Hasbro Nerf Elite 2.0',
	qty: 2,
	toteSlot: 'Tote 3'
};
