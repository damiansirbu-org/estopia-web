#!/bin/bash

# Estopia Frontend Build Script
# Builds the React application for production

set -e

echo "🔨 Building Estopia Frontend..."

# Check if Node.js is available
if ! command -v node > /dev/null 2>&1; then
    echo "❌ Node.js not found. Please install Node.js 18 or later."
    exit 1
fi

# Check if npm is available
if ! command -v npm > /dev/null 2>&1; then
    echo "❌ npm not found. Please install npm."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build the application
echo "🏗️ Building production bundle..."
npm run build

echo ""
echo "✅ Frontend built successfully!"
echo "📦 Build output: dist/"
echo "📊 Build size:"
du -sh dist/ 2>/dev/null || echo "Build directory created"
echo ""
echo "🚀 To preview: npm run preview"
echo "🌐 To serve: Serve the dist/ directory with a web server"