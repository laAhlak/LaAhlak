#!/usr/bin/env node

/**
 * Build script for Capacitor mobile apps
 * Temporarily moves API routes out of the way during build
 * since mobile apps don't need Next.js API routes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_DIR = path.join(process.cwd(), 'app', 'api');
const API_BACKUP_DIR = path.join(process.cwd(), '.capacitor-build', 'api.backup');

console.log('📱 Building for Capacitor...\n');

try {
  // Step 1: Backup API routes
  console.log('1️⃣  Backing up API routes...');
  if (fs.existsSync(API_DIR)) {
    // Create backup directory
    const backupParent = path.dirname(API_BACKUP_DIR);
    if (!fs.existsSync(backupParent)) {
      fs.mkdirSync(backupParent, { recursive: true });
    }
    if (fs.existsSync(API_BACKUP_DIR)) {
      fs.rmSync(API_BACKUP_DIR, { recursive: true, force: true });
    }
    fs.renameSync(API_DIR, API_BACKUP_DIR);
    console.log('   ✅ API routes backed up\n');
  }

  // Step 2: Switch to Capacitor config
  console.log('2️⃣  Switching to Capacitor config...');
  execSync('cp next.config.capacitor.js next.config.js', { stdio: 'inherit' });
  console.log('   ✅ Config switched\n');

  // Step 3: Build Next.js
  console.log('3️⃣  Building Next.js static export...');
  execSync('next build', { stdio: 'inherit' });
  console.log('   ✅ Build complete\n');

  // Step 4: Sync to Capacitor
  console.log('4️⃣  Syncing to Capacitor platforms...');
  const platform = process.argv[2]; // 'android' or 'ios' or undefined for both
  if (platform === 'android' || platform === 'ios') {
    execSync(`npx cap sync ${platform}`, { stdio: 'inherit' });
  } else {
    execSync('npx cap sync', { stdio: 'inherit' });
  }
  console.log('   ✅ Sync complete\n');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Step 5: Restore API routes
  console.log('5️⃣  Restoring API routes...');
  if (fs.existsSync(API_BACKUP_DIR)) {
    if (fs.existsSync(API_DIR)) {
      fs.rmSync(API_DIR, { recursive: true, force: true });
    }
    fs.renameSync(API_BACKUP_DIR, API_DIR);
    console.log('   ✅ API routes restored\n');
  }

  // Step 6: Restore original config
  console.log('6️⃣  Restoring original config...');
  if (fs.existsSync('next.config.backup.js')) {
    execSync('cp next.config.backup.js next.config.js', { stdio: 'inherit' });
    console.log('   ✅ Config restored\n');
  }
}

console.log('✨ Capacitor build complete!\n');
console.log('📱 Next steps:');
console.log('   - Android: npm run cap:open:android');
console.log('   - iOS: npm run cap:open:ios\n');

