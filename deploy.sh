#!/bin/bash

# 7-Day MVP Validation System - Netlify Deployment Script

echo "🚀 Starting deployment to Netlify..."

# Navigate to project directory
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f "prototype/package.json" ]; then
    echo "❌ Error: package.json not found in prototype directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd prototype
npm install

# Run build
echo "🔨 Building project..."
npm run build

# Go back to root
cd ..

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Login check
echo "🔑 Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    echo "Please login to Netlify:"
    netlify login
fi

# Deploy
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=prototype/frontend --message="Deploy 7-Day MVP Validation System with onboarding"

echo "✅ Deployment complete!"
echo ""
echo "🔗 Your site should be available at your Netlify URL"
echo "📊 Check the deployment status in your Netlify dashboard"
echo ""
echo "Next steps:"
echo "1. Set up custom domain (optional)"
echo "2. Configure environment variables in Netlify dashboard"
echo "3. Test all functionality on the live site"
echo "4. Set up monitoring and analytics"