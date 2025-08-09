#!/bin/bash

# estopia-web.sh - Frontend management script for Estopia
# Usage:
#   ./estopia-web.sh clean
#   ./estopia-web.sh build
#   ./estopia-web.sh start
#   ./estopia-web.sh stop

set -e

# Docker Hub credentials (set these for publishing)
export DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-damiansirbu}"
export DOCKERHUB_TOKEN="${DOCKERHUB_TOKEN:-dckr_pat_hpBKFPJ-OoPVu1AEl7ugliEZfhM}"

# Ensure we're in the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ACTION="$1"
PARAM2="$2"
PARAM3="$3"

# Handle combined commands like "clean fix build"
if [[ "$ACTION" == "clean" && "$PARAM2" == "fix" && "$PARAM3" == "build" ]]; then
    echo "🔄 Running: clean → fix → build"
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR"
    ./estopia-web.sh clean
    ./estopia-web.sh build
    exit 0
fi

show_help() {
    echo "🏗️  Estopia Frontend Management Script"
    echo ""
    echo "Usage: ./estopia-web.sh [command]"
    echo ""
    echo "Commands:"
    echo "  clean [full]         Clean build artifacts and cache (add 'full' to also remove node_modules)"
    echo "  build                Build the frontend for production"
    echo "  test [type]          Run comprehensive tests (unit|simulation|validation|api-contract|coverage|all)"
    echo "  clean fix build      Combined: clean → build (non-interactive)"
    echo "  start                Start the frontend development server"
    echo "  stop                 Stop the frontend development server"
    echo "  dockerize            Build frontend Docker image (estopia-web:latest)"
    echo "  publish [tag]        Push Docker image to registry (default: latest)"
    echo "  help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./estopia-web.sh clean"
    echo "  ./estopia-web.sh clean full"
    echo "  ./estopia-web.sh build"
    echo "  ./estopia-web.sh test                 # 🧪 Run all tests"
    echo "  ./estopia-web.sh test validation     # ✅ Run validation tests only" 
    echo "  ./estopia-web.sh test simulation     # 🎯 Run API simulation tests"
    echo "  ./estopia-web.sh clean fix build     # 🔄 Clean and build"
    echo "  ./estopia-web.sh start"
    echo "  ./estopia-web.sh dockerize            # 🐳 Build Docker image"
    echo "  ./estopia-web.sh publish v1.0.0       # 📤 Publish to Docker Hub"
    echo "  ./estopia-web.sh stop"
    echo ""
    echo "💡 Dependencies (Database, pgAdmin):"
    echo "   Start: cd ../estopia-infra && ./estopia-infra.sh start-deps"
    echo "   Stop:  cd ../estopia-infra && ./estopia-infra.sh stop"
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
        
        # Check for 'full' parameter to also clean node_modules
        if [[ "$2" == "full" ]]; then
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
    test)
        TEST_TYPE="$2"
        echo "🧪 Running Estopia Frontend Tests..."
        
        # Check if Node.js is available
        if ! command -v node > /dev/null 2>&1; then
            echo "❌ Node.js not found. Please install Node.js 18 or later."
            exit 1
        fi
        
        # Install dependencies if node_modules doesn't exist
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing dependencies (including test dependencies)..."
            npm install
        fi
        
        # Use our comprehensive test script
        if [ -f "./test.sh" ]; then
            case "$TEST_TYPE" in
                unit)
                    echo "🔬 Running unit tests with MSW API mocking..."
                    ./test.sh unit
                    ;;
                simulation)
                    echo "🎯 Running API simulation tests..."
                    ./test.sh simulation
                    ;;
                validation)
                    echo "✅ Running validation tests..."
                    ./test.sh validation
                    ;;
                api-contract)
                    echo "📋 Running API contract tests with MSW..."
                    ./test.sh api-contract
                    ;;
                coverage)
                    echo "📊 Running tests with coverage..."
                    ./test.sh coverage
                    ;;
                all)
                    echo "🚀 Running all tests (unit + simulation + validation)..."
                    ./test.sh unit
                    ./test.sh simulation
                    ./test.sh validation
                    ;;
                "")
                    echo "🧪 Running default tests (unit + validation)..."
                    ./test.sh unit
                    ./test.sh validation
                    ;;
                *)
                    echo "❌ Unknown test type: $TEST_TYPE"
                    echo "   Available types: unit, simulation, validation, api-contract, coverage, all"
                    exit 1
                    ;;
            esac
        else
            echo "❌ Test script not found at ./test.sh"
            echo "   Using fallback npm test command..."
            npm run test
        fi
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
    dockerize)
        echo "🐳 Building frontend Docker image..."
        
        # Check if Docker is running
        if ! docker info > /dev/null 2>&1; then
            echo "❌ Docker is not running. Please start Docker first."
            exit 1
        fi
        
        # Build production bundle first
        echo "🔨 Building production bundle..."
        npm run build
        
        # Build Docker image
        echo "🐳 Building Docker image..."
        docker build -t estopia-web:latest .
        
        echo "✅ Docker image built successfully: estopia-web:latest"
        echo "📊 Image size: $(docker images estopia-web:latest --format 'table {{.Size}}')"
        echo ""
        echo "🚀 To test the image:"
        echo "   docker run -p 80:80 estopia-web:latest"
        echo ""
        echo "📤 To publish:"
        echo "   ./estopia-web.sh publish [tag]"
        ;;
    publish)
        TAG="${2:-latest}"
        echo "📤 Publishing Docker image to registry..."
        
        # Check if image exists
        if ! docker images | grep -q estopia-web; then
            echo "❌ No estopia-web image found. Run './estopia-web.sh dockerize' first."
            exit 1
        fi
        
        # Tag for Docker Hub (assuming username from environment or config)
        DOCKER_USER="${DOCKERHUB_USERNAME:-damiansirbu}"
        
        # Auto-login if token is available
        if [ -n "$DOCKERHUB_TOKEN" ]; then
            echo "🔑 Logging in to Docker Hub..."
            echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKER_USER" --password-stdin
        fi
        
        echo "🏷️ Tagging image: $DOCKER_USER/estopia-web:$TAG"
        docker tag estopia-web:latest $DOCKER_USER/estopia-web:$TAG
        
        echo "🚀 Pushing to Docker Hub..."
        docker push $DOCKER_USER/estopia-web:$TAG
        
        echo "✅ Image published successfully!"
        echo "🐳 Pull with: docker pull $DOCKER_USER/estopia-web:$TAG"
        ;;
    help|-h|--help)
        show_help
        ;;
    ""|*)
        show_help
        exit 1
        ;;
esac