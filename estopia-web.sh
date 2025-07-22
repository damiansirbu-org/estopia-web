#!/bin/bash

# Estopia Web Development Script
# Usage: ./estopia-web.sh [clean]

echo "🏢 ESTOPIA WEB Development Script"
echo "=================================="

# Function to display browser reset instructions
show_browser_instructions() {
    echo ""
    echo "🌐 BROWSER CACHE RESET INSTRUCTIONS:"
    echo "-----------------------------------"
    echo "1. Hard Refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)"
    echo "2. Clear Cache: F12 → Network tab → Check 'Disable cache' → Refresh"
    echo "3. Incognito: Ctrl+Shift+N (Windows/Linux) or Cmd+Shift+N (Mac)"
    echo "4. Full Reset: F12 → Application → Storage → Clear site data"
    echo ""
}

# Function to run normal dev server
run_normal() {
    echo "🚀 Starting normal development server..."
    echo "Server will be available at: http://localhost:5173"
    show_browser_instructions
    npm run dev
}

# Function to clear all caches and run dev server
run_clean() {
    echo "🧹 CLEARING ALL CACHES AND STARTING FRESH..."
    echo ""

    # Stop any running Vite processes
    echo "🛑 Stopping any running Vite processes..."
    pkill -f "vite" 2>/dev/null || true

    # Clear Vite cache
    echo "🗑️  Clearing Vite cache..."
    if [ -d "node_modules/.vite" ]; then
        rm -rf node_modules/.vite
        echo "   ✅ Deleted node_modules/.vite"
    else
        echo "   ℹ️  node_modules/.vite not found"
    fi

    # Clear dist folder
    echo "🗑️  Clearing dist folder..."
    if [ -d "dist" ]; then
        rm -rf dist
        echo "   ✅ Deleted dist/"
    else
        echo "   ℹ️  dist/ not found"
    fi

    # Clear npm cache
    echo "🗑️  Clearing npm cache..."
    npm cache clean --force
    echo "   ✅ npm cache cleared"

    # Clear TypeScript build info
    echo "🗑️  Clearing TypeScript build cache..."
    if [ -d "node_modules/.tmp" ]; then
        rm -rf node_modules/.tmp
        echo "   ✅ Deleted node_modules/.tmp"
    else
        echo "   ℹ️  node_modules/.tmp not found"
    fi

    # Force reinstall dependencies
    echo "📦 Force reinstalling dependencies..."
    npm install --force
    echo "   ✅ Dependencies reinstalled"

    echo ""
    echo "🎉 ALL CACHES CLEARED!"
    echo "🚀 Starting fresh development server..."
    echo "Server will be available at: http://localhost:5173"

    show_browser_instructions

    # Start dev server
    npm run dev
}

# Main script logic
case "$1" in
    "clean")
        run_clean
        ;;
    "")
        run_normal
        ;;
    *)
        echo "Usage: $0 [clean]"
        echo ""
        echo "Options:"
        echo "  (no args)  - Start normal development server"
        echo "  clean      - Clear all caches and start fresh"
        echo ""
        show_browser_instructions
        exit 1
        ;;
esac