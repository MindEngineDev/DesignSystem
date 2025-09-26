#!/usr/bin/env node

/**
 * Figma Token Studio Webhook Handler
 * This script helps you set up automatic syncing from Figma to GitHub
 */

const GITHUB_OWNER = 'MindEngineDev';
const GITHUB_REPO = 'DesignSystem';

console.log('🎨 Figma Token Studio → GitHub Auto-Sync Setup\n');

console.log('Step 1: GitHub Webhook URL');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Use this URL in Figma Token Studio:');
console.log(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`);
console.log('');

console.log('Step 2: Required Headers in Figma Token Studio');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Authorization: Bearer YOUR_GITHUB_TOKEN');
console.log('Content-Type: application/json');
console.log('Accept: application/vnd.github.v3+json');
console.log('');

console.log('Step 3: Payload for Figma Token Studio');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('JSON Body:');
console.log(JSON.stringify({
  event_type: 'figma-tokens-update',
  client_payload: {
    source: 'figma-token-studio',
    timestamp: new Date().toISOString()
  }
}, null, 2));
console.log('');

console.log('Step 4: Create GitHub Personal Access Token');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. Go to: https://github.com/settings/tokens');
console.log('2. Click "Generate new token (classic)"');
console.log('3. Select scopes: repo, workflow');
console.log('4. Copy the token and use it in Figma Token Studio');
console.log('');

console.log('Alternative: Manual Trigger Command');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Run this to manually trigger sync:');
console.log('npm run sync');
console.log('');

console.log('✅ Setup complete! Your tokens will auto-sync when updated in Figma.');