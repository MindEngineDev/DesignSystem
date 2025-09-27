#!/usr/bin/env node
// scripts/sync-tokens.js
import chokidar from 'chokidar';
import { spawn } from 'child_process';

const NPM_BIN = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const TOKENS_GLOB = 'tokens/**/*.json';
const SD_CONFIG = 'config/sd.config.mjs';

function run(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

async function build() {
  console.log('🧱 Building tokens…');
  await run(NPM_BIN, ['run', 'tokens:build']);
  console.log('✅ Tokens built into styles/');
}

async function watch() {
  console.log('👀 Watching tokens…');
  const watcher = chokidar.watch([TOKENS_GLOB, SD_CONFIG], { ignoreInitial: true });
  watcher.on('change', async (file) => {
    console.log(`✳ Changed: ${file}`);
    try {
      await build();
    } catch (error) {
      console.error('❌ Token build failed:', error.message);
    }
  });
}

if (process.argv.includes('--watch')) {
  watch();
} else {
  build().catch((error) => {
    console.error('❌ Token build failed:', error.message);
    process.exitCode = 1;
  });
}
