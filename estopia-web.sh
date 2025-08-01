#!/bin/bash

# Estopia Web Development Script with Quality Control
# Usage: ./estopia-web.sh [start|clean|check|fix|build|watch|help]

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

# Function to show help
show_help() {
    echo ""
    echo "🔧 AVAILABLE COMMANDS:"
    echo "====================="
    echo ""
    echo "🚀 DEVELOPMENT:"
    echo "  ./estopia-web.sh           - Start normal development server (default)"
    echo "  ./estopia-web.sh start     - Start normal development server" 
    echo "  ./estopia-web.sh clean     - Clear all caches and start fresh"
    echo ""
    echo "🛡️  QUALITY CONTROL:"
    echo "  ./estopia-web.sh check     - Run full quality check (TypeScript + ESLint)"
    echo "  ./estopia-web.sh fix       - Auto-fix ESLint issues + type check"
    echo "  ./estopia-web.sh watch     - Watch mode for TypeScript errors"
    echo "  ./estopia-web.sh lint      - Run ESLint only"
    echo "  ./estopia-web.sh types     - Run TypeScript check only"
    echo ""
    echo "🏗️  BUILD & DEPLOY:"
    echo "  ./estopia-web.sh build     - Safe build (with quality checks)"
    echo "  ./estopia-web.sh build-only - Build without quality checks"
    echo ""
    echo "🔄 COMBINED COMMANDS:"
    echo "  ./estopia-web.sh clean build      - Clean everything then safe build"
    echo "  ./estopia-web.sh clean check      - Clean everything then quality check"
    echo "  ./estopia-web.sh fix build        - Auto-fix then safe build"
    echo "  ./estopia-web.sh check build      - Quality check then build"
    echo "  ./estopia-web.sh clean fix build  - Clean, fix, then build"
    echo ""
    echo "📋 OTHER:"
    echo "  ./estopia-web.sh help      - Show this help"
    echo ""
    show_browser_instructions
}

# Function to run quality check
run_quality_check() {
    echo "🛡️  RUNNING QUALITY CHECKS..."
    echo "============================="
    echo ""

    echo "🔍 TypeScript Type Checking..."
    if npm run type-check; then
        echo "   ✅ TypeScript: No type errors found!"
    else
        echo "   ❌ TypeScript: Type errors detected!"
        echo ""
        echo "💡 TIP: Run './estopia-web.sh watch' to see errors in real-time"
        return 1
    fi

    echo ""
    echo "🔍 ESLint Code Quality Check..."
    if npm run lint:strict; then
        echo "   ✅ ESLint: Code quality looks good!"
    else
        echo "   ❌ ESLint: Code quality issues detected!"
        echo ""
        echo "💡 TIP: Run './estopia-web.sh fix' to auto-fix many issues"
        return 1
    fi

    echo ""
    echo "🎉 ALL QUALITY CHECKS PASSED!"
    echo "✅ Your code is ready for development/deployment"
}

# Function to auto-fix issues
run_quality_fix() {
    echo "🔧 AUTO-FIXING CODE ISSUES..."
    echo "============================="
    echo ""

    echo "🔧 Running ESLint auto-fix..."
    npm run lint:fix
    echo "   ✅ ESLint auto-fix completed!"

    echo ""
    echo "🔍 Re-checking TypeScript..."
    if npm run type-check; then
        echo "   ✅ TypeScript: All good after fixes!"
        echo ""
        echo "🎉 Code quality improved! Ready to continue development."
    else
        echo "   ⚠️  TypeScript: Some issues still need manual fixing"
        echo ""
        echo "💡 TIP: Run './estopia-web.sh watch' to see remaining errors"
    fi
}

# Function to run TypeScript watch mode
run_type_watch() {
    echo "👀 STARTING TYPESCRIPT WATCH MODE..."
    echo "===================================="
    echo ""
    echo "📺 Watching for TypeScript errors in real-time..."
    echo "   Press Ctrl+C to stop"
    echo ""
    npm run type-check:watch
}

# Function to run normal dev server
run_normal() {
    echo "🚀 Starting normal development server..."
    echo "Server will be available at: http://localhost:5173"
    echo ""
    echo "💡 TIP: Run './estopia-web.sh check' before committing!"
    show_browser_instructions
    npm run dev
}

# Function to clear all caches and run dev server
run_clean() {
    echo "🧹 CLEARING ALL CACHES AND STARTING FRESH..."
    echo ""

    # Stop any running processes
    echo "🛑 Stopping any running processes..."
    pkill -f "vite" 2>/dev/null || true
    pkill -f "tsc" 2>/dev/null || true

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

    # Clear TypeScript build info
    echo "🗑️  Clearing TypeScript build cache..."
    if [ -d "node_modules/.tmp" ]; then
        rm -rf node_modules/.tmp
        echo "   ✅ Deleted node_modules/.tmp"
    else
        echo "   ℹ️  node_modules/.tmp not found"
    fi

    # Clear npm cache
    echo "🗑️  Clearing npm cache..."
    npm cache clean --force
    echo "   ✅ npm cache cleared"

    # Force reinstall dependencies
    echo "📦 Force reinstalling dependencies..."
    npm install --force
    echo "   ✅ Dependencies reinstalled"

    echo ""
    echo "🎉 ALL CACHES CLEARED!"
    echo "🚀 Starting fresh development server..."
    echo "Server will be available at: http://localhost:5173"

    show_browser_instructions
    npm run dev
}

# Function to run clean without starting dev server
run_clean_only() {
    echo "🧹 CLEARING ALL CACHES..."
    echo "========================="
    echo ""

    # Stop any running processes
    echo "🛑 Stopping any running processes..."
    pkill -f "vite" 2>/dev/null || true
    pkill -f "tsc" 2>/dev/null || true

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

    # Clear TypeScript build info
    echo "🗑️  Clearing TypeScript build cache..."
    if [ -d "node_modules/.tmp" ]; then
        rm -rf node_modules/.tmp
        echo "   ✅ Deleted node_modules/.tmp"
    else
        echo "   ℹ️  node_modules/.tmp not found"
    fi

    # Clear npm cache
    echo "🗑️  Clearing npm cache..."
    npm cache clean --force
    echo "   ✅ npm cache cleared"

    # Force reinstall dependencies
    echo "📦 Force reinstalling dependencies..."
    npm install --force
    echo "   ✅ Dependencies reinstalled"

    echo ""
    echo "🎉 ALL CACHES CLEARED!"
}

# Function to run safe build
run_safe_build() {
    echo "🏗️  SAFE BUILD WITH QUALITY CHECKS..."
    echo "====================================="
    echo ""

    echo "🛡️  Running pre-build quality checks..."
    if run_quality_check; then
        echo ""
        echo "🏗️  Building application..."
        if npm run build; then
            echo ""
            echo "🎉 BUILD SUCCESSFUL!"
            echo "✅ Your application is ready for deployment"
            echo "📁 Built files are in './dist' directory"
        else
            echo ""
            echo "❌ BUILD FAILED!"
            echo "Check the errors above and fix them"
            return 1
        fi
    else
        echo ""
        echo "❌ PRE-BUILD QUALITY CHECKS FAILED!"
        echo "Fix the issues above before building"
        echo "💡 TIP: Run './estopia-web.sh fix' to auto-fix many issues"
        return 1
    fi
}

# Function to run build without checks
run_build_only() {
    echo "🏗️  BUILDING WITHOUT QUALITY CHECKS..."
    echo "======================================"
    echo ""
    echo "⚠️  WARNING: Skipping quality checks!"
    echo ""
    npm run build
}

# Function to execute commands in sequence
execute_commands() {
    local commands=("$@")
    local success=true

    echo "🔄 EXECUTING COMMAND SEQUENCE: ${commands[*]}"
    echo "=============================================="
    echo ""

    for cmd in "${commands[@]}"; do
        case "$cmd" in
            "clean")
                echo "📍 Step: CLEAN"
                run_clean_only
                ;;
            "check")
                echo "📍 Step: QUALITY CHECK"
                if ! run_quality_check; then
                    success=false
                    break
                fi
                ;;
            "fix")
                echo "📍 Step: AUTO-FIX"
                run_quality_fix
                ;;
            "build")
                echo "📍 Step: BUILD"
                if ! run_safe_build; then
                    success=false
                    break
                fi
                ;;
            "build-only")
                echo "📍 Step: BUILD (no checks)"
                if ! run_build_only; then
                    success=false
                    break
                fi
                ;;
            "lint")
                echo "📍 Step: LINT"
                if ! npm run lint:strict; then
                    success=false
                    break
                fi
                ;;
            "types")
                echo "📍 Step: TYPE CHECK"
                if ! npm run type-check; then
                    success=false
                    break
                fi
                ;;
            *)
                echo "❌ Unknown command in sequence: $cmd"
                success=false
                break
                ;;
        esac
        echo ""
    done

    if $success; then
        echo "🎉 ALL COMMANDS COMPLETED SUCCESSFULLY!"
        echo "✅ Command sequence: ${commands[*]}"
    else
        echo "❌ COMMAND SEQUENCE FAILED!"
        echo "Failed at: $cmd"
        return 1
    fi
}

# Main script logic
if [ $# -eq 0 ]; then
    # No arguments - start development server
    run_normal
elif [ $# -eq 1 ]; then
    # Single argument - handle as before
    case "$1" in
        "start")
            run_normal
            ;;
        "clean")
            run_clean
            ;;
        "check")
            run_quality_check
            ;;
        "fix")
            run_quality_fix
            ;;
        "watch")
            run_type_watch
            ;;
        "lint")
            echo "🔍 Running ESLint only..."
            npm run lint:strict
            ;;
        "types")
            echo "🔍 Running TypeScript check only..."
            npm run type-check
            ;;
        "build")
            run_safe_build
            ;;
        "build-only")
            run_build_only
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            echo "❌ Unknown command: $1"
            echo ""
            echo "Use './estopia-web.sh help' to see available commands"
            exit 1
            ;;
    esac
else
    # Multiple arguments - execute in sequence
    execute_commands "$@"
fi