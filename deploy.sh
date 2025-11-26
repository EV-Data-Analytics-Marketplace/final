#!/bin/bash
# deploy.sh - EV Project Docker Deployment Script for Linux/Mac
# Author: Auto-generated
# Date: 26/11/2025

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Flags
SKIP_BUILD=false
CLEAN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --help)
            echo -e "${CYAN}EV Project Docker Deployment Script${NC}"
            echo ""
            echo "Usage: ./deploy.sh [options]"
            echo ""
            echo "Options:"
            echo "    --skip-build    Skip building JAR files (use existing JARs)"
            echo "    --clean         Clean deployment (remove volumes and rebuild)"
            echo "    --help          Show this help message"
            echo ""
            echo "Examples:"
            echo "    ./deploy.sh                  # Normal deployment"
            echo "    ./deploy.sh --skip-build     # Deploy without rebuilding JARs"
            echo "    ./deploy.sh --clean          # Clean deployment (reset databases)"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}   EV Project Docker Deployment Script${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""

# Check Docker
echo -e "${YELLOW}[CHECK] Verifying Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found. Please install Docker.${NC}"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
echo -e "${GREEN}✓ Docker found: ${DOCKER_VERSION}${NC}"

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose not found. Please install Docker Compose.${NC}"
    exit 1
fi

COMPOSE_VERSION=$(docker compose version)
echo -e "${GREEN}✓ Docker Compose found: ${COMPOSE_VERSION}${NC}"

# Clean deployment if requested
if [ "$CLEAN" = true ]; then
    echo -e "\n${YELLOW}[CLEAN] Removing existing deployment...${NC}"
    docker compose down -v
    echo -e "${GREEN}✓ Cleaned successfully${NC}"
fi

# Build JAR files unless skipped
if [ "$SKIP_BUILD" = false ]; then
    echo -e "\n${YELLOW}[1/3] Building JAR files...${NC}"
    echo -e "${CYAN}This may take 2-3 minutes...${NC}"

    services=("eureka-server" "api-gateway" "identity-service" "data-service" "payment-service" "analytics-service")
    total=${#services[@]}
    current=0

    start_time=$(date +%s)

    for service in "${services[@]}"; do
        ((current++))
        echo -e "${CYAN}  [$current/$total] Building $service...${NC}"

        cd "$service" || exit 1

        if ! ./mvnw clean package -DskipTests -q; then
            echo -e "${RED}    ✗ Failed to build $service${NC}"
            exit 1
        fi

        echo -e "${GREEN}    ✓ $service built successfully${NC}"
        cd .. || exit 1
    done

    end_time=$(date +%s)
    duration=$((end_time - start_time))
    minutes=$(echo "scale=2; $duration/60" | bc)

    echo -e "\n${GREEN}✓ All JAR files built in ${minutes} minutes${NC}"

    # Verify JARs
    echo -e "\n${YELLOW}[2/3] Verifying JAR files...${NC}"
    jar_count=$(find . -path "*/target/*.jar" ! -name "*.original" | wc -l)

    if [ "$jar_count" -eq "$total" ]; then
        echo -e "${GREEN}✓ Found all $jar_count JAR files:${NC}"
        find . -path "*/target/*.jar" ! -name "*.original" -exec basename {} \; | while read -r jar; do
            echo -e "${CYAN}    - $jar${NC}"
        done
    else
        echo -e "${RED}✗ Expected $total JAR files, found $jar_count${NC}"
        exit 1
    fi
else
    echo -e "\n${MAGENTA}[SKIP] Skipping JAR build...${NC}"
fi

# Deploy to Docker
echo -e "\n${YELLOW}[3/3] Deploying to Docker...${NC}"
echo -e "${CYAN}Building and starting containers...${NC}"

deploy_start=$(date +%s)
docker compose up -d --build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Docker deployment failed${NC}"
    exit 1
fi

deploy_end=$(date +%s)
deploy_duration=$((deploy_end - deploy_start))

echo -e "${GREEN}✓ Docker containers started in ${deploy_duration} seconds${NC}"

# Wait for services to initialize
echo -e "\n${YELLOW}[WAIT] Waiting for services to initialize (30 seconds)...${NC}"
for i in {30..1}; do
    echo -ne "${CYAN}  $i seconds remaining...\r${NC}"
    sleep 1
done
echo -e "${GREEN}  ✓ Wait complete${NC}                    "

# Check deployment status
echo -e "\n${GREEN}=============================================${NC}"
echo -e "${GREEN}         Deployment Status${NC}"
echo -e "${GREEN}=============================================${NC}"

docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# Count running containers
running=$(docker compose ps --filter "status=running" -q | wc -l)
total_containers=$(docker compose ps -q | wc -l)

echo -e "\n${GREEN}✓ Running: $running/$total_containers containers${NC}"

# Service URLs
echo -e "\n${GREEN}=============================================${NC}"
echo -e "${GREEN}         Service URLs${NC}"
echo -e "${GREEN}=============================================${NC}"
echo -e "${CYAN}Eureka Dashboard:   http://localhost:8761${NC}"
echo -e "${CYAN}Frontend:           http://localhost${NC}"
echo -e "${CYAN}API Gateway:        http://localhost:8080${NC}"
echo -e "${CYAN}Identity Service:   http://localhost:8081${NC}"
echo -e "${CYAN}Data Service:       http://localhost:8082${NC}"
echo -e "${CYAN}Payment Service:    http://localhost:8083${NC}"
echo -e "${CYAN}Analytics Service:  http://localhost:8084${NC}"

# Database connections
echo -e "\n${GREEN}=============================================${NC}"
echo -e "${GREEN}         Database Connections${NC}"
echo -e "${GREEN}=============================================${NC}"
echo -e "${CYAN}Identity DB:        localhost:3307${NC}"
echo -e "${CYAN}Data DB:            localhost:3308${NC}"
echo -e "${CYAN}Payment DB:         localhost:3309${NC}"
echo -e "${CYAN}Analytics DB:       localhost:3310${NC}"
echo -e "${CYAN}Username:           root${NC}"
echo -e "${CYAN}Password:           root123${NC}"

# Quick health check
echo -e "\n${YELLOW}[HEALTH] Performing quick health checks...${NC}"

health_checks=(
    "Eureka:http://localhost:8761"
    "Frontend:http://localhost"
    "API Gateway:http://localhost:8080/actuator/health"
)

for check in "${health_checks[@]}"; do
    IFS=':' read -r name url <<< "$check"
    if curl -s -f -m 5 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ $name: OK${NC}"
    else
        echo -e "${MAGENTA}  ⚠ $name: Not ready yet (may need more time)${NC}"
    fi
done

# Summary
if [ "$SKIP_BUILD" = false ]; then
    total_end=$(date +%s)
    total_duration=$((total_end - start_time))
    total_minutes=$(echo "scale=2; $total_duration/60" | bc)

    echo -e "\n${GREEN}=============================================${NC}"
    echo -e "${GREEN}         Deployment Complete!${NC}"
    echo -e "${GREEN}=============================================${NC}"
    echo -e "${GREEN}Total time: ${total_minutes} minutes${NC}"
else
    echo -e "\n${GREEN}=============================================${NC}"
    echo -e "${GREEN}         Deployment Complete!${NC}"
    echo -e "${GREEN}=============================================${NC}"
fi

echo ""
echo -e "${CYAN}Useful commands:${NC}"
echo -e "${CYAN}  docker compose logs -f              # View all logs${NC}"
echo -e "${CYAN}  docker compose ps                   # View status${NC}"
echo -e "${CYAN}  docker compose down                 # Stop all services${NC}"
echo -e "${CYAN}  docker compose down -v              # Stop and remove volumes${NC}"
echo -e "${CYAN}  docker compose restart <service>    # Restart a service${NC}"
echo ""

