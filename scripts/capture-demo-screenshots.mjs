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
const MOBILE_VIEWPORT = { width: 390, height: 844 };

const shots = [
	{ file: 'slide-10-executive-happy.png', path: '/demo/?screenshot=1', clipToImpact: true },
	{ file: 'slide-10-executive-alert.png', path: '/demo/?state=alert&screenshot=1', clipToImpact: true },
	{ file: 'slide-10-executive-gated.png', path: '/demo/?state=gated&screenshot=1', clipToImpact: true },
	{ file: 'slide-11-compliance-alert.png', path: '/demo/compliance?state=alert&screenshot=1' },
	{ file: 'slide-11-compliance-happy.png', path: '/demo/compliance?state=happy&screenshot=1' },
	{ file: 'slide-11-compliance-gated.png', path: '/demo/compliance?state=gated&screenshot=1' },
	{ file: 'slide-11-compliance-loading.png', path: '/demo/compliance?state=loading&screenshot=1' },
	{ file: 'slide-12-pick-happy.png', path: '/demo/pick?screenshot=1', mobile: true },
	{
		file: 'slide-12-pick-scan-item.png',
		path: '/demo/pick?screenshot=1',
		mobile: true,
		interact: 'scan-item'
	},
	{ file: 'slide-12-pick-exception.png', path: '/demo/pick?state=alert&screenshot=1', mobile: true },
	{ file: 'slide-12-pick-rerouting.png', path: '/demo/pick?state=loading&screenshot=1', mobile: true },
	{ file: 'slide-12-pick-rerouted.png', path: '/demo/pick?state=rerouted&screenshot=1', mobile: true },
	{ file: 'slide-13-pack-happy.png', path: '/demo/pack?screenshot=1' },
	{ file: 'slide-13-pack-gated.png', path: '/demo/pack?state=gated&screenshot=1' },
	{ file: 'slide-13-pack-alert.png', path: '/demo/pack?state=alert&screenshot=1' }
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT });

for (const shot of shots) {
	if (shot.mobile) {
		await page.setViewportSize(MOBILE_VIEWPORT);
	} else {
		await page.setViewportSize(VIEWPORT);
	}

	await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' });

	if (shot.interact === 'scan-item') {
		await page.getByRole('button', { name: /Scan bin/i }).click();
		await page.waitForTimeout(300);
	}

	if (shot.clipToImpact) {
		const chrome = page.locator('.dashboard-chrome');
		const impact = page.locator('.impact-band');
		await chrome.waitFor({ state: 'visible' });
		await impact.waitFor({ state: 'visible' });
		const chromeBox = await chrome.boundingBox();
		const impactBox = await impact.boundingBox();
		if (!chromeBox || !impactBox) throw new Error(`Missing layout for ${shot.file}`);
		await page.screenshot({
			path: join(OUT, shot.file),
			clip: {
				x: 0,
				y: chromeBox.y,
				width: VIEWPORT.width,
				height: impactBox.y + impactBox.height - chromeBox.y
			}
		});
	} else if (shot.mobile) {
		const frame = page.locator('.viewport.mobile');
		await frame.waitFor({ state: 'visible' });
		await frame.screenshot({ path: join(OUT, shot.file) });
	} else {
		await page.screenshot({ path: join(OUT, shot.file), fullPage: false });
	}
	console.log('Wrote', shot.file);
}

await browser.close();
console.log('Screenshots saved to', OUT);
