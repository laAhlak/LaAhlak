#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting build process with fallback configurations...\n');

// List of configurations to try in order
const configs = [
  { name: 'Clean Config', file: 'next.config.clean.js' },
  { name: 'Minimal Config', file: 'next.config.minimal.js' },
  { name: 'Current Config', file: 'next.config.js' }
];

// Backup current config
try {
  execSync('cp next.config.js next.config.backup.js', { stdio: 'inherit' });
  console.log('✅ Backed up current configuration\n');
} catch (error) {
  console.log('⚠️  Could not backup current configuration\n');
}

let buildSuccess = false;

for (const config of configs) {
  try {
    console.log(`🔧 Trying ${config.name}...`);
    
    // Copy config file
    execSync(`cp ${config.file} next.config.js`, { stdio: 'inherit' });
    
    // Try to build
    console.log('📦 Building...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log(`✅ Build successful with ${config.name}!`);
    buildSuccess = true;
    break;
    
  } catch (error) {
    console.log(`❌ Build failed with ${config.name}`);
    console.log('🔄 Trying next configuration...\n');
  }
}

if (!buildSuccess) {
  console.log('❌ All build configurations failed!');
  console.log('🔧 Restoring original configuration...');
  try {
    execSync('cp next.config.backup.js next.config.js', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Could not restore original configuration');
  }
  process.exit(1);
} else {
  console.log('\n🎉 Build completed successfully!');
  console.log('💡 Your app is ready for deployment.');
}
