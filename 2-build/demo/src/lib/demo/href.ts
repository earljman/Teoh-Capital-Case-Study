import { resolve } from '$app/paths';
import type { AppPath, DemoState } from './types';

/** Build a demo route href with optional state and screenshot params. */
export function demoHref(
	path: AppPath,
	opts?: { state?: DemoState; screenshot?: boolean }
): string {
	const resolved = resolve(path);
	const url = new URL(resolved, 'http://local');
	if (opts?.state && opts.state !== 'happy') {
		url.searchParams.set('state', opts.state);
	}
	if (opts?.screenshot) {
		url.searchParams.set('screenshot', '1');
	}
	const qs = url.search;
	return url.pathname + (qs === '?' ? '' : qs);
}

export function isScreenshotMode(searchParams: URLSearchParams): boolean {
	return searchParams.get('screenshot') === '1';
}
