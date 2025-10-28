#!/bin/bash

# CI/CD Helper Scripts for BoatsStats Project
# This script provides utilities for local development and CI/CD operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install dependencies
install_deps() {
    log_info "Installing dependencies..."
    
    if ! command_exists node; then
        log_error "Node.js is not installed. Please install Node.js 22.x"
        exit 1
    fi
    
    if ! command_exists npm; then
        log_error "npm is not installed"
        exit 1
    fi
    
    npm ci
    npx playwright install chromium
    
    log_success "Dependencies installed successfully"
}

# Run all tests
run_tests() {
    log_info "Running all tests..."
    
    # Unit tests
    log_info "Running unit tests..."
    npm run test:ci
    
    # E2E tests
    log_info "Running E2E tests..."
    npm run test:e2e
    
    log_success "All tests completed successfully"
}

# Build all packages
build_all() {
    log_info "Building all packages..."
    
    # Build backend
    log_info "Building backend..."
    cd packages/backend
    npm run build
    cd ../..
    
    # Build frontend
    log_info "Building frontend..."
    cd packages/frontend
    npm run build
    cd ../..
    
    log_success "All packages built successfully"
}

# Build Docker images
build_docker() {
    log_info "Building Docker images..."
    
    if ! command_exists docker; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Build backend image
    log_info "Building backend Docker image..."
    docker build -t boatsstats-backend:latest packages/backend/
    
    # Build frontend image
    log_info "Building frontend Docker image..."
    docker build -t boatsstats-frontend:latest packages/frontend/
    
    log_success "Docker images built successfully"
}

# Run Docker containers
run_docker() {
    log_info "Starting Docker containers..."
    
    if ! command_exists docker-compose; then
        log_error "docker-compose is not installed"
        exit 1
    fi
    
    docker-compose up -d
    
    log_success "Docker containers started successfully"
    log_info "Frontend: http://localhost:3000"
    log_info "Backend: http://localhost:8080"
    log_info "Nginx: http://localhost:80"
}

# Stop Docker containers
stop_docker() {
    log_info "Stopping Docker containers..."
    
    docker-compose down
    
    log_success "Docker containers stopped successfully"
}

# Run linting
run_lint() {
    log_info "Running linting..."
    
    # Backend linting
    log_info "Linting backend..."
    cd packages/backend
    npm run lint:fix
    cd ../..
    
    # Frontend linting
    log_info "Linting frontend..."
    cd packages/frontend
    npm run lint
    cd ../..
    
    log_success "Linting completed successfully"
}

# Clean up
cleanup() {
    log_info "Cleaning up..."
    
    # Remove node_modules
    rm -rf node_modules
    rm -rf packages/*/node_modules
    
    # Remove build artifacts
    rm -rf packages/*/dist
    rm -rf packages/*/.next
    rm -rf packages/*/coverage
    
    # Remove test artifacts
    rm -rf test-results
    rm -rf playwright-report
    
    log_success "Cleanup completed successfully"
}

# Health check
health_check() {
    log_info "Performing health checks..."
    
    # Check backend health
    if curl -f http://localhost:8080/health >/dev/null 2>&1; then
        log_success "Backend is healthy"
    else
        log_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend health
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        log_success "Frontend is healthy"
    else
        log_error "Frontend health check failed"
        return 1
    fi
    
    log_success "All health checks passed"
}

# Show help
show_help() {
    echo "BoatsStats CI/CD Helper Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     Install all dependencies"
    echo "  test        Run all tests"
    echo "  build       Build all packages"
    echo "  docker      Build Docker images"
    echo "  up          Start Docker containers"
    echo "  down        Stop Docker containers"
    echo "  lint        Run linting"
    echo "  clean       Clean up build artifacts"
    echo "  health      Perform health checks"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 test       # Run all tests"
    echo "  $0 up         # Start development environment"
    echo "  $0 health     # Check if services are running"
}

# Main script logic
case "${1:-help}" in
    install)
        install_deps
        ;;
    test)
        run_tests
        ;;
    build)
        build_all
        ;;
    docker)
        build_docker
        ;;
    up)
        run_docker
        ;;
    down)
        stop_docker
        ;;
    lint)
        run_lint
        ;;
    clean)
        cleanup
        ;;
    health)
        health_check
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
