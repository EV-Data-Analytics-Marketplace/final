@echo off
echo ===============================================
echo    EV Platform - Backend Services Startup
echo ===============================================
echo.

echo [1/4] Starting MySQL Databases...
docker-compose up -d mysql-identity mysql-data mysql-payment mysql-analytics
timeout /t 10 /nobreak > nul

echo.
echo [2/4] Starting Eureka Server (Service Discovery)...
docker-compose up -d eureka-server
timeout /t 20 /nobreak > nul

echo.
echo [3/4] Starting Microservices...
docker-compose up -d identity-service data-service payment-service analytics-service
timeout /t 15 /nobreak > nul

echo.
echo [4/4] Starting API Gateway...
docker-compose up -d api-gateway
timeout /t 10 /nobreak > nul

echo.
echo ===============================================
echo    Backend Services Started Successfully!
echo ===============================================
echo.
echo Checking service status...
docker-compose ps
echo.
echo ===============================================
echo    Access Points:
echo ===============================================
echo   - Eureka Dashboard: http://localhost:8761
echo   - API Gateway:      http://localhost:8080
echo   - Identity Service: http://localhost:8081
echo   - Data Service:     http://localhost:8082
echo   - Payment Service:  http://localhost:8083
echo   - Analytics Service: http://localhost:8084
echo ===============================================
echo.
echo Opening Eureka Dashboard...
timeout /t 3 /nobreak > nul
start http://localhost:8761
echo.
echo ===============================================
echo    Next Steps:
echo ===============================================
echo   1. Wait for all services to show UP in Eureka
echo   2. Start frontend:
echo      cd ev-frontend
echo      npm run dev
echo   3. Open: http://localhost:3000
echo ===============================================
echo.
pause

