#!/bin/bash

# Estopia Frontend Clean Script
# Cleans build artifacts, cache, and node_modules

set -e

echo "🧹 Cleaning Estopia Frontend..."

# Clean build artifacts
if [ -d "dist" ]; then
    echo "🗑️ Removing dist directory..."
    rm -rf dist
fi

# Clean Vite cache
if [ -d "node_modules/.vite" ]; then
    echo "🗑️ Removing Vite cache..."
    rm -rf node_modules/.vite
fi

# Clean other cache directories
if [ -d ".vite" ]; then
    echo "🗑️ Removing .vite directory..."
    rm -rf .vite
fi

# Option to clean node_modules
read -p "🤔 Also remove node_modules? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d "node_modules" ]; then
        echo "🗑️ Removing node_modules..."
        rm -rf node_modules
        echo "💡 Run 'npm install' to reinstall dependencies"
    fi
fi

echo "✅ Frontend cleaned successfully!"