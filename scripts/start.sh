#!/bin/bash

# Estopia Frontend Start Script
# Starts the React development server with hot reload

set -e

echo "🚀 Starting Estopia Frontend..."

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

# Start the development server
echo "⚡ Starting Vite development server..."
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🔧 Backend API should be running at: http://localhost:8080"
echo "🛑 Stop with: Ctrl+C or ./scripts/stop.sh"
echo ""

npm run dev