@echo off
echo ========================================
echo Rebuild and Deploy EV Platform
echo ========================================

echo.
echo [1/4] Stopping all containers and removing volumes...
docker-compose down -v

echo.
echo [2/4] Building all services (this may take several minutes)...
docker-compose build --no-cache

echo.
echo [3/4] Starting all services...
docker-compose up -d

echo.
echo [4/4] Checking service status...
timeout /t 10 /nobreak >nul
docker-compose ps

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Services:
echo - Eureka Server:    http://localhost:8761
echo - API Gateway:      http://localhost:8080
echo - Frontend:         http://localhost
echo - Identity Service: http://localhost:8081
echo - Data Service:     http://localhost:8082
echo - Payment Service:  http://localhost:8083
echo - Analytics Service: http://localhost:8084
echo.
echo MySQL Databases:
echo - Identity:  localhost:3307
echo - Data:      localhost:3308
echo - Payment:   localhost:3309
echo - Analytics: localhost:3310
echo.
echo To view logs: docker-compose logs -f [service-name]
echo To stop all:  docker-compose down
echo ========================================

