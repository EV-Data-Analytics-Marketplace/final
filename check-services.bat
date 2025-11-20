@echo off
echo ========================================
echo Starting EV Platform Services
echo ========================================
echo.

echo [Step 1] Starting all containers...
docker-compose up -d

echo.
echo [Step 2] Waiting 15 seconds for services to initialize...
timeout /t 15 /nobreak >nul

echo.
echo [Step 3] Checking service health...
echo.
echo --- Eureka Server ---
docker logs ev-eureka-server --tail 5 2>&1 | findstr /i "Started"

echo.
echo --- API Gateway ---
docker logs ev-api-gateway --tail 5 2>&1 | findstr /i "Started"

echo.
echo --- Identity Service ---
docker logs ev-identity-service --tail 5 2>&1 | findstr /i "Started"

echo.
echo --- Data Service ---
docker logs ev-data-service --tail 5 2>&1 | findstr /i "Started"

echo.
echo --- Payment Service ---
docker logs ev-payment-service --tail 5 2>&1 | findstr /i "Started"

echo.
echo --- Analytics Service ---
docker logs ev-analytics-service --tail 5 2>&1 | findstr /i "Started"

echo.
echo ========================================
echo Service URLs:
echo ========================================
echo Frontend:         http://localhost
echo API Gateway:      http://localhost:8080
echo Eureka Dashboard: http://localhost:8761
echo ========================================
echo.
echo To view full logs: docker logs [container-name]
echo To stop all:       docker-compose down
echo ========================================

