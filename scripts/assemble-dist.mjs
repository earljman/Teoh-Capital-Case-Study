import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

cpSync(join(root, 'slides/discover-phase.html'), join(dist, 'index.html'));
cpSync(join(root, 'prototype/build/demo'), join(dist, 'demo'), { recursive: true });
cpSync(join(root, 'prototype/build/_headers'), join(dist, '_headers'));

console.log('Assembled dist/: slides at /, demo at /demo');
