// vite.config.mjs
import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@styles': resolve(__dirname, './styles'),
      '@utils': resolve(__dirname, './utils'),
      '@plugins': resolve(__dirname, './plugins'),
      '@public': resolve(__dirname, './public'),
      '@assets': resolve(__dirname, './assets')
    }
  }
});
