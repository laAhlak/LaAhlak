#!/bin/bash

# 🌐 Update ngrok URL in .env.local
# Usage: ./scripts/update-ngrok-url.sh <your-ngrok-url>

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌐 ngrok URL Updater${NC}\n"

# Check if URL provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Please provide your ngrok URL${NC}"
  echo ""
  echo "Usage:"
  echo "  ./scripts/update-ngrok-url.sh <your-ngrok-url>"
  echo ""
  echo "Example:"
  echo "  ./scripts/update-ngrok-url.sh https://loreta-palmiest-glady.ngrok-free.dev"
  exit 1
fi

NGROK_URL=$1

# Remove trailing slash if present
NGROK_URL=${NGROK_URL%/}

# Validate URL format
if [[ ! $NGROK_URL =~ ^https://.*\.ngrok-free\.dev$ ]]; then
  echo -e "${YELLOW}⚠️  Warning: URL doesn't match ngrok format (https://xxx.ngrok-free.dev)${NC}"
  echo -e "${YELLOW}   Continuing anyway...${NC}\n"
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}⚠️  .env.local not found. Creating from template...${NC}"
  
  if [ -f env.template ]; then
    cp env.template .env.local
    echo -e "${GREEN}✅ Created .env.local from env.template${NC}\n"
  else
    echo -e "${RED}❌ Error: env.template not found!${NC}"
    exit 1
  fi
fi

# Backup existing .env.local
cp .env.local .env.local.backup
echo -e "${GREEN}✅ Backed up .env.local to .env.local.backup${NC}"

# Update NEXT_PUBLIC_APP_URL
if grep -q "^NEXT_PUBLIC_APP_URL=" .env.local; then
  # Replace existing line
  sed -i "s|^NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=$NGROK_URL|" .env.local
  echo -e "${GREEN}✅ Updated NEXT_PUBLIC_APP_URL to: $NGROK_URL${NC}"
else
  # Add new line
  echo "NEXT_PUBLIC_APP_URL=$NGROK_URL" >> .env.local
  echo -e "${GREEN}✅ Added NEXT_PUBLIC_APP_URL: $NGROK_URL${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Configuration updated successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo "1. Configure Stripe Webhook:"
echo "   - Go to: https://dashboard.stripe.com/test/webhooks"
echo "   - Add endpoint: ${NGROK_URL}/api/stripe/webhook"
echo "   - Select events: checkout.session.completed, checkout.session.expired"
echo "   - Copy webhook secret to .env.local"
echo ""
echo "2. Restart your dev server:"
echo "   - Stop current server (Ctrl+C)"
echo "   - Run: npm run dev"
echo ""
echo -e "${GREEN}✅ Your app will now use: $NGROK_URL${NC}"

