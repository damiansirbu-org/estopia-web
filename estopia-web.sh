#!/bin/bash

# estopia-web.sh - Frontend management script for Estopia
# Usage:
#   ./estopia-web.sh clean
#   ./estopia-web.sh build
#   ./estopia-web.sh start
#   ./estopia-web.sh stop

set -e

ACTION="$1"

show_help() {
    echo "🏗️  Estopia Frontend Management Script"
    echo ""
    echo "Usage: ./estopia-web.sh [command]"
    echo ""
    echo "Commands:"
    echo "  clean                Clean build artifacts and cache"
    echo "  build                Build the frontend for production"
    echo "  start                Start the frontend development server"
    echo "  stop                 Stop the frontend development server"
    echo "  help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./estopia-web.sh clean"
    echo "  ./estopia-web.sh build"
    echo "  ./estopia-web.sh start"
    echo "  ./estopia-web.sh stop"
    echo ""
    echo "💡 Dependencies (Database, pgAdmin):"
    echo "   Start: cd ../estopia-infra && ./scripts/start-dependencies.sh"
    echo "   Stop:  cd ../estopia-infra && docker-compose -f docker-compose.dev.yml down"
}

case "$ACTION" in
    clean)
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
        ;;
    build)
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
        du -sh dist/ 2>/dev/null || echo "Build directory created"
        echo ""
        echo "🚀 To preview: npm run preview"
        ;;
    start)
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
        
        echo "⚡ Starting Vite development server..."
        echo "📱 Frontend will be available at: http://localhost:5173"
        echo "🔧 Backend API should be running at: http://localhost:8080"
        echo "🛑 Stop with: Ctrl+C or ./estopia-web.sh stop"
        echo ""
        
        npm run dev
        ;;
    stop)
        echo "🛑 Stopping Estopia Frontend..."
        
        # Find and kill Vite processes
        PIDS=$(ps aux | grep '[n]ode.*vite' | awk '{print $2}')
        
        if [ -z "$PIDS" ]; then
            echo "No Vite development server found."
        else
            echo "Found Vite processes: $PIDS"
            for PID in $PIDS; do
                echo "Stopping process $PID..."
                kill $PID
            done
            
            # Wait a moment and check if processes are stopped
            sleep 2
            REMAINING=$(ps aux | grep '[n]ode.*vite' | awk '{print $2}')
            
            if [ -z "$REMAINING" ]; then
                echo "✅ Frontend stopped successfully!"
            else
                echo "⚠️ Some processes may still be running: $REMAINING"
                echo "Use 'kill -9 $REMAINING' if needed."
            fi
        fi
        ;;
    help|-h|--help)
        show_help
        ;;
    ""|*)
        show_help
        exit 1
        ;;
esac