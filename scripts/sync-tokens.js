#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';

const execAsync = promisify(exec);

class TokenSync {
  constructor() {
    this.tokensPath = './packages/tokens';
    this.outputPath = './site/dist';
  }

  async syncFromFigma() {
    console.log('Ìæ® Syncing tokens from Figma...');
    try {
      await execAsync('git pull origin main');
      await this.buildTokens();
      console.log('‚úÖ Tokens synced successfully');
    } catch (error) {
      console.error('‚ùå Sync failed:', error);
    }
  }

  async buildTokens() {
    console.log('Ì¥® Building tokens...');
    await execAsync('npm run build:tokens');
  }

  watch() {
    console.log('Ì±ÅÔ∏è Watching for token changes...');
    const watcher = chokidar.watch([
      path.join(this.tokensPath, '*.json'),
      './sd.config.mjs'
    ], {
      persistent: true,
      ignoreInitial: true
    });

    watcher.on('change', async (filepath) => {
      console.log(`Ì≥ù ${filepath} changed`);
      await this.buildTokens();
    });
  }
}

const sync = new TokenSync();
if (process.argv.includes('--watch')) {
  sync.watch();
} else {
  sync.syncFromFigma();
}
