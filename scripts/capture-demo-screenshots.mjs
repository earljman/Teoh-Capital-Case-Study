#!/usr/bin/env node
/**
 * Capture demo screenshots for deck slides 10–13.
 * Requires dev server: npm run dev --prefix 2-build/demo
 */
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, '3-present', 'screenshots');
const BASE = process.env.DEMO_URL ?? 'http://localhost:5173';

const VIEWPORT = { width: 1280, height: 900 };

const shots = [
	{ file: 'slide-10-executive-happy.png', path: '/demo/?screenshot=1' },
	{ file: 'slide-10-executive-alert.png', path: '/demo/?state=alert&screenshot=1' },
	{ file: 'slide-10-executive-gated.png', path: '/demo/?state=gated&screenshot=1' },
	{ file: 'slide-11-compliance-alert.png', path: '/demo/compliance?state=alert&screenshot=1' },
	{ file: 'slide-12-pick-happy.png', path: '/demo/pick?screenshot=1' },
	{ file: 'slide-12-pick-exception.png', path: '/demo/pick?screenshot=1', interact: 'exception' },
	{ file: 'slide-13-pack-happy.png', path: '/demo/pack?screenshot=1' },
	{ file: 'slide-13-pack-gated.png', path: '/demo/pack?state=gated&screenshot=1' }
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT });

for (const shot of shots) {
	await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' });
	if (shot.interact === 'exception') {
		await page.getByRole('button', { name: /Long-press/i }).click();
		await page.waitForTimeout(300);
	}
	await page.screenshot({ path: join(OUT, shot.file), fullPage: false });
	console.log('Wrote', shot.file);
}

await browser.close();
console.log('Screenshots saved to', OUT);
