// scripts/sync-tokens.js
#!/usr/bin/env node
import chokidar from 'chokidar';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const TOKENS_GLOB = 'tokens/**/*.json';
const SD_CONFIG = 'config/sd.config.mjs';

async function build() {
  console.log('🧱 Building tokens…');
  await execAsync('npx style-dictionary build --config config/sd.config.mjs', { stdio: 'inherit' });
  console.log('✅ Tokens built into styles/');
}

async function watch() {
  console.log('👀 Watching tokens…');
  const watcher = chokidar.watch([TOKENS_GLOB, SD_CONFIG], { ignoreInitial: true });
  watcher.on('change', async (file) => {
    console.log(`✳ Changed: ${file}`);
    await build();
  });
}

if (process.argv.includes('--watch')) {
  watch();
} else {
  build();
}
