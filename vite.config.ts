/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Deployed under https://<user>.github.io/Pandle/ on GitHub Pages.
// The app root lives in src/ so the repo root can hold the committed build
// output — GitHub Pages "deploy from branch" then serves the built app
// directly (run `npm run build && npm run sync:pages` before pushing).
export default defineConfig({
  base: '/Pandle/',
  root: 'src',
  publicDir: '../public',
  build: { outDir: '../dist', emptyOutDir: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Pandle — Bamboo Grove',
        short_name: 'Pandle',
        description: 'A cute panda picross puzzle. Solve by logic, reveal the panda!',
        theme_color: '#7bc47f',
        background_color: '#fdf6ec',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test-setup.ts',
  },
});
