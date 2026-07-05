// Copy the built app (dist/) into the repo root so GitHub Pages
// "deploy from branch" serves the real game. Run after `npm run build`,
// then commit the changes. Removes previous build output first so stale
// hashed assets don't pile up.
import { cpSync, rmSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/index.html missing — run `npm run build` first');
  process.exit(1);
}

// Known build outputs at the repo root (never touches src/, public/, etc.).
const OUTPUTS = [
  'index.html', 'assets', 'manifest.webmanifest', 'sw.js', 'registerSW.js',
  'favicon.svg', 'apple-touch-icon.png', 'pwa-192.png', 'pwa-512.png',
];
for (const name of OUTPUTS) {
  rmSync(join(ROOT, name), { recursive: true, force: true });
}
for (const name of readdirSync(ROOT)) {
  if (name.startsWith('workbox-') && name.endsWith('.js')) {
    rmSync(join(ROOT, name), { force: true });
  }
}

for (const name of readdirSync(DIST)) {
  cpSync(join(DIST, name), join(ROOT, name), { recursive: true });
}
// Skip Jekyll processing on the Pages branch build.
writeFileSync(join(ROOT, '.nojekyll'), '');
console.log('synced dist/ -> repo root');
