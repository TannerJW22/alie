import { access, rename, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const clientDirectory = resolve('dist/client');
const nestedAssets = resolve(clientDirectory, 'alie/_next');
const publicAssets = resolve(clientDirectory, '_next');

try {
  await access(nestedAssets);
} catch {
  console.log('GitHub Pages asset layout already normalized.');
  process.exit(0);
}

await rm(publicAssets, { recursive: true, force: true });
await rename(nestedAssets, publicAssets);
await rm(resolve(clientDirectory, 'alie'), { recursive: true, force: true });

console.log('Normalized GitHub Pages assets into dist/client/_next.');
