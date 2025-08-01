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
        ./scripts/clean.sh
        ;;
    build)
        echo "🔨 Building Estopia Frontend..."
        ./scripts/build.sh
        ;;
    start)
        echo "🚀 Starting Estopia Frontend..."
        ./scripts/start.sh
        ;;
    stop)
        echo "🛑 Stopping Estopia Frontend..."
        ./scripts/stop.sh
        ;;
    help|-h|--help)
        show_help
        ;;
    ""|*)
        show_help
        exit 1
        ;;
esac