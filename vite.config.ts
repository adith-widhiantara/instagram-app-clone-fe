/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const plugins = [react()];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: plugins,
  define: {
    global: 'window',
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
