/** Relative "last refreshed" label for live dashboard chrome. */
export function formatLastRefreshed(updatedAt: number, now = Date.now()): string {
	const sec = Math.max(0, Math.floor((now - updatedAt) / 1000));
	if (sec < 8) return 'just now';
	if (sec < 60) return `${sec}s ago`;
	const min = Math.floor(sec / 60);
	return min === 1 ? '1m ago' : `${min}m ago`;
}
