import { cpSync, mkdirSync, rmSync, watch } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const watchMode = process.argv.includes('--watch');

const copyFile = (from, to) => cpSync(join(root, from), join(dist, to));
const resetCopyDir = (from, to) => {
  const target = join(dist, to);
  rmSync(target, { recursive: true, force: true });
  cpSync(join(root, from), target, { recursive: true });
};

function syncDeckToDist() {
  mkdirSync(dist, { recursive: true });
  copyFile('3-present/index.html', 'index.html');
  copyFile('3-present/content-bank.html', 'content-bank.html');
  resetCopyDir('3-present/shared', 'shared');
  resetCopyDir('3-present/images', 'images');
  resetCopyDir('3-present/slides', 'slides');
  resetCopyDir('0-research', 'research');
  // Local dev: keep /demo routed to the Vite server while Netlify serves slides from dist.
  copyFile('3-present/_redirects.dev', '_redirects');
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
