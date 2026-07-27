import { cp, rm, writeFile, readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'code');
const dest = join(root, 'docs');
const cnamePath = join(dest, 'CNAME');

let cname = null;
try {
  await access(cnamePath, constants.F_OK);
  cname = await readFile(cnamePath, 'utf8');
} catch {
  // No existing CNAME to preserve.
}

await rm(dest, { recursive: true, force: true });
await cp(src, dest, { recursive: true });
// Prevent GitHub Pages (Jekyll) from ignoring or rewriting static assets.
await writeFile(join(dest, '.nojekyll'), '');

if (cname !== null) {
  await writeFile(cnamePath, cname);
}

console.log('Built code/ → docs/');
