import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves a project site from /<repo>/, so the build needs that
// prefix on every asset URL; dev stays at the root so `npm run dev` is
// unaffected.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/portfolio-universe/' : '/',
  plugins: [react()],
  server: { host: true },
}));
