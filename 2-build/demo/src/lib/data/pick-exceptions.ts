export type PickExceptionKind = 'damaged' | 'wrong';

export type PickExceptionNextStep = {
	title: string;
	body: string;
};

export const PICK_EXCEPTION_NEXT_STEPS: Record<PickExceptionKind, PickExceptionNextStep> = {
	damaged: {
		title: 'Damaged goods reported',
		body: 'Next step: scan quarantine label on the damaged unit. Supervisor gets an inventory alert and the system reroutes remaining qty to an alternate bin.'
	},
	wrong: {
		title: 'Wrong item in bin',
		body: 'Next step: capture a photo of the bin label. An inventory adjustment ticket opens and the pick reroutes to the verified location for this SKU.'
	}
};
