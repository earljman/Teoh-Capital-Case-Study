import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

cpSync(join(root, '3-present/index.html'), join(dist, 'index.html'));
cpSync(join(root, '3-present/content-bank.html'), join(dist, 'content-bank.html'));
cpSync(join(root, '3-present/shared'), join(dist, 'shared'), { recursive: true });
cpSync(join(root, '3-present/images'), join(dist, 'images'), { recursive: true });
cpSync(join(root, '3-present/screenshots'), join(dist, 'screenshots'), { recursive: true });
cpSync(join(root, '3-present/slides'), join(dist, 'slides'), { recursive: true });
cpSync(join(root, '0-research'), join(dist, 'research'), { recursive: true });
cpSync(join(root, '3-present/_redirects.prod'), join(dist, '_redirects'));
cpSync(join(root, '2-build/demo/build/demo'), join(dist, 'demo'), { recursive: true });
cpSync(join(root, '2-build/demo/build/_headers'), join(dist, '_headers'));

console.log('Assembled dist/: slides at /, demo at /demo');
