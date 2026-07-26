import { cp, rm, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'code');
const dest = join(root, 'docs');

await rm(dest, { recursive: true, force: true });
await cp(src, dest, { recursive: true });
// Prevent GitHub Pages (Jekyll) from ignoring or rewriting static assets.
await writeFile(join(dest, '.nojekyll'), '');
console.log('Built code/ → docs/');
