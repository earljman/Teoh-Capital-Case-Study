import { cpSync, mkdirSync, readFileSync, rmSync, watch, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const watchMode = process.argv.includes('--watch');

const DEV_RELOAD_SNIPPET = `
<script>
(function () {
	if (location.hostname !== 'localhost' || location.port !== '8888') return;
	var last = '';
	setInterval(function () {
		fetch('/shared/.dev-reload', { cache: 'no-store' })
			.then(function (r) { return r.text(); })
			.then(function (stamp) {
				if (last && stamp !== last) location.reload();
				last = stamp;
			})
			.catch(function () {});
	}, 500);
})();
</script>`;

const copyFile = (from, to) => cpSync(join(root, from), join(dist, to));
const resetCopyDir = (from, to) => {
	const target = join(dist, to);
	rmSync(target, { recursive: true, force: true });
	cpSync(join(root, from), target, { recursive: true });
};

function syncDeckToDist() {
	mkdirSync(dist, { recursive: true });
	rmSync(join(dist, 'demo'), { recursive: true, force: true });
	copyFile('3-present/index.html', 'index.html');
	copyFile('3-present/content-bank.html', 'content-bank.html');
	resetCopyDir('3-present/shared', 'shared');
	resetCopyDir('3-present/images', 'images');
	resetCopyDir('3-present/screenshots', 'screenshots');
	resetCopyDir('3-present/slides', 'slides');
	resetCopyDir('0-research', 'research');
	copyFile('3-present/_redirects.prod', '_redirects');
	copyFile('3-present/_headers.prod', '_headers');

	if (watchMode) {
		const html = readFileSync(join(root, '3-present/index.html'), 'utf8').replace(
			'</body>',
			`${DEV_RELOAD_SNIPPET}\n</body>`
		);
		writeFileSync(join(dist, 'index.html'), html);
		writeFileSync(join(dist, 'shared', '.dev-reload'), String(Date.now()));
	}

	console.log(`[deck-sync] Updated dist at ${new Date().toLocaleTimeString()}`);
}

let timer;
function debouncedSync() {
	clearTimeout(timer);
	timer = setTimeout(syncDeckToDist, 120);
}

syncDeckToDist();

if (watchMode) {
	console.log('[deck-sync] Watching 3-present and 0-research for changes...');
	const watchOptions = { recursive: true };
	watch(join(root, '3-present'), watchOptions, debouncedSync);
	watch(join(root, '0-research'), watchOptions, debouncedSync);
}
