import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

cpSync(join(root, '3-present/discover-phase.html'), join(dist, 'index.html'));
cpSync(join(root, '2-build/demo/build/demo'), join(dist, 'demo'), { recursive: true });
cpSync(join(root, '2-build/demo/build/_headers'), join(dist, '_headers'));

console.log('Assembled dist/: deck at /, demo at /demo');
