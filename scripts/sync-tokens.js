#!/usr/bin/env node
// scripts/sync-tokens.js
import chokidar from 'chokidar';
import { spawn } from 'child_process';

const TOKENS_GLOB = 'tokens/**/*.json';
const SD_CONFIG = 'config/sd.config.mjs';

function getNpmInvocation(args = []) {
  const npmExecPath = process.env.npm_execpath || process.env.npm_execPath;
  const nodeExecPath = process.env.npm_node_execpath || process.execPath;

  if (npmExecPath && npmExecPath.endsWith('npm-cli.js')) {
    return {
      command: nodeExecPath,
      args: [npmExecPath, ...args],
    };
  }

  const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return { command: npmBin, args };
}

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
  const npm = getNpmInvocation(['run', 'tokens:build']);
  await run(npm.command, npm.args);
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
