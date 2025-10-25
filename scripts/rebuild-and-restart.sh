#!/bin/bash

# Automation script: Apply changes, build, and restart
# Usage: ./scripts/rebuild-and-restart.sh

echo "🔄 Starting automated rebuild and restart process..."
echo ""

# Step 1: Stop any running npm processes
echo "🛑 Step 1/3: Stopping running npm processes..."
pkill -f "npm run dev" || true
pkill -f "next dev" || true
pkill -f "npm start" || true
pkill -f "next start" || true
sleep 2
echo "✅ Processes stopped"
echo ""

# Step 2: Build the project
echo "🔨 Step 2/3: Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    
    # Step 3: Start the production server
    echo "🚀 Step 3/3: Starting production server..."
    npm start
else
    echo ""
    echo "❌ Build failed! Please check the errors above."
    echo "Production server will NOT be started."
    exit 1
fi

