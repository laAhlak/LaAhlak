#!/usr/bin/env node

/**
 * Automation script: Apply changes, build, and restart
 * Usage: node scripts/rebuild-and-restart.js
 */

const { spawn, exec } = require('child_process');
const process = require('process');

console.log('🔄 Starting automated rebuild and restart process...\n');

// Step 1: Stop any running npm processes
console.log('🛑 Step 1/3: Stopping running npm processes...');

const killCommand = process.platform === 'win32'
  ? 'taskkill /F /IM node.exe /T'
  : 'pkill -f "npm|next"';

exec(killCommand, (error) => {
  // Ignore errors (process might not be running)
  setTimeout(() => {
    console.log('✅ Processes stopped\n');
    
    // Step 2: Build the project
    console.log('🔨 Step 2/3: Building the project...');
    
    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      shell: true
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Build successful!\n');
        
        // Step 3: Start the production server
        console.log('🚀 Step 3/3: Starting production server...');
        
        const startProcess = spawn('npm', ['start'], {
          stdio: 'inherit',
          shell: true
        });
        
        startProcess.on('error', (err) => {
          console.error('❌ Failed to start server:', err);
          process.exit(1);
        });
      } else {
        console.error('\n❌ Build failed! Please check the errors above.');
        console.error('Production server will NOT be started.');
        process.exit(1);
      }
    });
    
    buildProcess.on('error', (err) => {
      console.error('❌ Failed to build:', err);
      process.exit(1);
    });
  }, 2000);
});

