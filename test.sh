#!/bin/bash

# Estopia Web Frontend Test Script
# Comprehensive test runner for the frontend with MSW API mocking

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  test, unit           Run unit tests with MSW API mocking"
    echo "  watch                Run tests in watch mode"
    echo "  ui                   Run tests with UI dashboard"
    echo "  coverage             Run tests with coverage report"
    echo "  simulation           Run API simulation tests (command-line only)"
    echo "  validation           Run validation-specific tests"
    echo "  api-contract         Run API contract tests with MSW"
    echo "  install              Install test dependencies"
    echo "  clean                Clean test artifacts and run all tests"
    echo "  help, -h, --help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./test.sh unit                # Run unit tests"
    echo "  ./test.sh watch               # Run tests in watch mode"
    echo "  ./test.sh simulation          # Run API simulation tests"
    echo "  ./test.sh validation          # Run validation tests"
    echo "  ./test.sh api-contract        # Run API contract tests"
    echo "  ./test.sh coverage            # Run with coverage"
}

ensure_dependencies() {
    if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/vitest" ]; then
        echo "📦 Installing test dependencies..."
        npm install
    fi
}

run_unit_tests() {
    echo "🧪 Running unit tests with MSW API mocking..."
    ensure_dependencies
    npm run test
}

run_watch_tests() {
    echo "👀 Running tests in watch mode..."
    ensure_dependencies
    npm run test:watch
}

run_ui_tests() {
    echo "🎨 Running tests with UI dashboard..."
    ensure_dependencies
    npm run test:ui
}

run_coverage_tests() {
    echo "📊 Running tests with coverage..."
    ensure_dependencies
    npm run test:coverage
    echo "📊 Coverage report generated at: coverage/index.html"
}

run_simulation_tests() {
    echo "🎯 Running API simulation tests..."
    ensure_dependencies
    npm run test -- --run --reporter=verbose --testNamePattern="simulation|contract"
}

run_validation_tests() {
    echo "✅ Running validation tests..."
    ensure_dependencies
    npm run test -- --run --reporter=verbose validation
}

run_api_contract_tests() {
    echo "📋 Running API contract tests with MSW..."
    ensure_dependencies
    npm run test -- --run --reporter=verbose api-contract
}

install_dependencies() {
    echo "📦 Installing all test dependencies..."
    npm install
    echo "✅ All dependencies installed!"
}

run_clean_tests() {
    echo "🧹 Cleaning and running all tests..."
    rm -rf coverage dist node_modules/.vite
    run_unit_tests
}

run_lint_and_type_check() {
    echo "🔍 Running linting and type checking..."
    npm run lint
    npm run type-check
}

case "${1:-test}" in
    test|unit)
        run_unit_tests
        ;;
    watch)
        run_watch_tests
        ;;
    ui)
        run_ui_tests
        ;;
    coverage)
        run_coverage_tests
        ;;
    simulation)
        run_simulation_tests
        ;;
    validation)
        run_validation_tests
        ;;
    api-contract)
        run_api_contract_tests
        ;;
    install)
        install_dependencies
        ;;
    clean)
        run_clean_tests
        ;;
    lint)
        run_lint_and_type_check
        ;;
    help|-h|--help)
        print_usage
        ;;
    *)
        echo "❌ Unknown command: $1"
        print_usage
        exit 1
        ;;
esac

echo "✅ Frontend tests completed successfully!"