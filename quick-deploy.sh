#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   EV Platform - Quick Deploy${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}[ERROR] Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo -e "${CYAN}[1/6] Stopping existing containers...${NC}"
docker-compose down -v

echo ""
echo -e "${CYAN}[2/6] Building services (this may take 15-20 minutes)...${NC}"
docker-compose build --no-cache

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Build failed!${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}[3/6] Starting databases...${NC}"
docker-compose up -d mysql-identity mysql-data mysql-payment mysql-analytics

echo -e "${YELLOW}Waiting for databases to be ready (30 seconds)...${NC}"
sleep 30

echo ""
echo -e "${CYAN}[4/6] Starting Eureka Server...${NC}"
docker-compose up -d eureka-server

echo -e "${YELLOW}Waiting for Eureka Server (20 seconds)...${NC}"
sleep 20

echo ""
echo -e "${CYAN}[5/6] Starting all other services...${NC}"
docker-compose up -d

echo ""
echo -e "${CYAN}[6/6] Waiting for services to fully start (30 seconds)...${NC}"
sleep 30

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Service URLs:${NC}"
echo -e "  ${CYAN}- Frontend:${NC}    http://localhost"
echo -e "  ${CYAN}- API Gateway:${NC} http://localhost:8080"
echo -e "  ${CYAN}- Eureka:${NC}      http://localhost:8761"
echo ""
echo -e "${YELLOW}Login Credentials:${NC}"
echo -e "  ${CYAN}- Email:${NC}    admin@evdata.com"
echo -e "  ${CYAN}- Password:${NC} password"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Open http://localhost in your browser"
echo -e "  2. Clear cache (Ctrl+Shift+Delete)"
echo -e "  3. Hard reload (Ctrl+Shift+R)"
echo -e "  4. Login with credentials above"
echo ""
echo -e "${YELLOW}To view logs:${NC} docker-compose logs -f"
echo -e "${YELLOW}To stop all:${NC}  docker-compose down"
echo -e "${GREEN}========================================${NC}"
echo ""

# Ask to open browser
read -p "Open browser now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open http://localhost
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost 2>/dev/null || echo "Please open http://localhost manually"
    fi
    echo -e "${GREEN}Browser opened!${NC}"
fi

echo ""
echo -e "${GREEN}Happy Coding! 🚀${NC}"

