import type { AppPath, ScreenId } from './types';

export type ScreenMeta = {
	id: ScreenId;
	path: AppPath;
	label: string;
	slide: string;
};

export const SCREENS: ScreenMeta[] = [
	{ id: 'executive', path: '/', label: 'Executive', slide: '10' },
	{ id: 'supervisor', path: '/supervisor', label: 'Supervisor', slide: 'Appendix' },
	{ id: 'compliance', path: '/compliance', label: 'Compliance', slide: '11' },
	{ id: 'pick', path: '/pick', label: 'Pick-path', slide: '12' },
	{ id: 'pack', path: '/pack', label: 'Cartonization', slide: '13' }
];

export function screenForPath(pathname: string): ScreenMeta {
	return SCREENS.find((s) => s.path === pathname) ?? SCREENS[0];
}
