import { DEMO_STATES, type DemoState } from './types';

export function parseDemoState(value: string | null): DemoState {
	if (value && DEMO_STATES.includes(value as DemoState)) {
		return value as DemoState;
	}
	return 'happy';
}
