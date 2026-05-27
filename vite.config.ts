import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  envDir: '..',
  build: {
    outDir: './dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve('./src')
    },
  },
  server: {
    port: 3000
  }
});
