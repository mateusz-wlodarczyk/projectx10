#!/bin/bash

# Deployment Script for BoatsStats Project
# This script handles deployment to DigitalOcean

set -e

# Configuration
APP_NAME="boatsstats"
REGION="fra1"
SIZE="s-1vcpu-1gb"
IMAGE="docker-20-04"
BACKEND_PORT=8080
FRONTEND_PORT=3000

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

# Check if doctl is installed
check_doctl() {
    if ! command -v doctl >/dev/null 2>&1; then
        log_error "doctl is not installed. Please install it first:"
        echo "https://docs.digitalocean.com/reference/doctl/how-to/install/"
        exit 1
    fi
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        log_error "Docker is not installed"
        exit 1
    fi
}

# Authenticate with DigitalOcean
authenticate() {
    log_info "Authenticating with DigitalOcean..."
    
    if [ -z "$DO_TOKEN" ]; then
        log_error "DO_TOKEN environment variable is not set"
        log_info "Please set your DigitalOcean API token:"
        echo "export DO_TOKEN=your_token_here"
        exit 1
    fi
    
    doctl auth init -t "$DO_TOKEN"
    log_success "Authenticated with DigitalOcean"
}

# Create droplet
create_droplet() {
    log_info "Creating DigitalOcean droplet..."
    
    # Check if droplet already exists
    if doctl compute droplet list --format Name --no-header | grep -q "^${APP_NAME}$"; then
        log_warning "Droplet ${APP_NAME} already exists"
        return 0
    fi
    
    doctl compute droplet create "$APP_NAME" \
        --image "$IMAGE" \
        --size "$SIZE" \
        --region "$REGION" \
        --ssh-keys "$(doctl compute ssh-key list --format ID --no-header | head -1)" \
        --wait
    
    log_success "Droplet created successfully"
}

# Get droplet IP
get_droplet_ip() {
    doctl compute droplet list --format Name,PublicIPv4 --no-header | grep "^${APP_NAME}" | awk '{print $2}'
}

# Setup droplet
setup_droplet() {
    local ip=$(get_droplet_ip)
    log_info "Setting up droplet at $ip..."
    
    # Wait for droplet to be ready
    log_info "Waiting for droplet to be ready..."
    sleep 30
    
    # Copy deployment files
    log_info "Copying deployment files..."
    scp -o StrictHostKeyChecking=no docker-compose.yml root@"$ip":/root/
    scp -o StrictHostKeyChecking=no nginx.conf root@"$ip":/root/
    scp -o StrictHostKeyChecking=no scripts/deploy.sh root@"$ip":/root/
    
    # Run setup commands
    log_info "Running setup commands on droplet..."
    ssh -o StrictHostKeyChecking=no root@"$ip" << 'EOF'
        # Update system
        apt-get update
        apt-get upgrade -y
        
        # Install Docker
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        
        # Install Docker Compose
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        
        # Install doctl
        snap install doctl
        
        # Create app directory
        mkdir -p /opt/boatsstats
        cd /opt/boatsstats
        
        # Copy files
        cp /root/docker-compose.yml .
        cp /root/nginx.conf .
        cp /root/deploy.sh .
        chmod +x deploy.sh
EOF
    
    log_success "Droplet setup completed"
}

# Deploy application
deploy_app() {
    local ip=$(get_droplet_ip)
    log_info "Deploying application to $ip..."
    
    ssh -o StrictHostKeyChecking=no root@"$ip" << 'EOF'
        cd /opt/boatsstats
        
        # Pull latest images
        docker-compose pull
        
        # Start services
        docker-compose up -d
        
        # Wait for services to be ready
        sleep 30
        
        # Check health
        curl -f http://localhost/health || exit 1
EOF
    
    log_success "Application deployed successfully"
    log_info "Application is available at: http://$(get_droplet_ip)"
}

# Show status
show_status() {
    local ip=$(get_droplet_ip)
    log_info "Checking application status..."
    
    if [ -z "$ip" ]; then
        log_error "Droplet not found"
        return 1
    fi
    
    log_info "Droplet IP: $ip"
    
    # Check if application is responding
    if curl -f "http://$ip/health" >/dev/null 2>&1; then
        log_success "Application is running and healthy"
        log_info "Frontend: http://$ip"
        log_info "Backend API: http://$ip/api"
    else
        log_error "Application is not responding"
        return 1
    fi
}

# Cleanup
cleanup() {
    log_info "Cleaning up..."
    
    if doctl compute droplet list --format Name --no-header | grep -q "^${APP_NAME}$"; then
        log_info "Destroying droplet..."
        doctl compute droplet delete "$APP_NAME" --force
        log_success "Droplet destroyed"
    else
        log_warning "Droplet not found"
    fi
}

# Show help
show_help() {
    echo "BoatsStats Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  create      Create DigitalOcean droplet"
    echo "  setup       Setup droplet with Docker and dependencies"
    echo "  deploy      Deploy application to droplet"
    echo "  status      Show application status"
    echo "  cleanup     Destroy droplet and cleanup"
    echo "  help        Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DO_TOKEN    DigitalOcean API token (required)"
    echo ""
    echo "Examples:"
    echo "  export DO_TOKEN=your_token_here"
    echo "  $0 create    # Create droplet"
    echo "  $0 setup     # Setup droplet"
    echo "  $0 deploy    # Deploy application"
    echo "  $0 status    # Check status"
}

# Main script logic
case "${1:-help}" in
    create)
        check_doctl
        authenticate
        create_droplet
        ;;
    setup)
        check_doctl
        authenticate
        setup_droplet
        ;;
    deploy)
        check_doctl
        authenticate
        deploy_app
        ;;
    status)
        check_doctl
        authenticate
        show_status
        ;;
    cleanup)
        check_doctl
        authenticate
        cleanup
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
