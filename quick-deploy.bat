@echo off
REM Quick deploy script for EV Platform

echo ========================================
echo EV Platform - Quick Deploy
echo ========================================
echo.

REM Stop and remove all existing containers
echo [1/6] Stopping existing containers...
docker-compose down -v

echo.
echo [2/6] Building services (this will take time)...
docker-compose build --no-cache

echo.
echo [3/6] Starting databases...
docker-compose up -d mysql-identity mysql-data mysql-payment mysql-analytics

echo.
echo [4/6] Waiting for databases to be ready (30 seconds)...
timeout /t 30 /nobreak

echo.
echo [5/6] Starting Eureka Server...
docker-compose up -d eureka-server

echo.
echo Waiting for Eureka Server (20 seconds)...
timeout /t 20 /nobreak

echo.
echo [6/6] Starting all other services...
docker-compose up -d

echo.
echo ========================================
echo Deployment initiated!
echo ========================================
echo.
echo Waiting for services to fully start (30 seconds)...
timeout /t 30 /nobreak

echo.
echo Opening Eureka Dashboard...
start http://localhost:8761

echo.
echo ========================================
echo Access your application:
echo - Frontend:    http://localhost
echo - API Gateway: http://localhost:8080
echo - Eureka:      http://localhost:8761
echo ========================================
pause

