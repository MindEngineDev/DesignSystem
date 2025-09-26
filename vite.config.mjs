import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'site',
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5173'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tokens': resolve(__dirname, './site/dist'),
      '@components': resolve(__dirname, './src/components')
    }
  }
});
