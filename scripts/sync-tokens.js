#!/usr/bin/env node
// scripts/sync-tokens.js
import chokidar from 'chokidar';
import { spawn } from 'child_process';

const NPM_BIN = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const NPM_EXEC_PATH = process.env.npm_execpath;
const NODE_BIN = process.execPath;

const TOKENS_GLOB = 'tokens/**/*.json';
const SD_CONFIG = 'config/sd.config.mjs';

function run(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });

    child.on('error', reject);
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
  if (NPM_EXEC_PATH) {
    await run(NODE_BIN, [NPM_EXEC_PATH, 'run', 'tokens:build']);
  } else {
    await run(NPM_BIN, ['run', 'tokens:build'], { shell: process.platform === 'win32' });
  }
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
