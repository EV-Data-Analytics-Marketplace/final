@echo off
cls
echo ========================================
echo    EV Platform - Login Fix Verification
echo ========================================
echo.
echo [INFO] API paths have been fixed:
echo   - /identity/api/auth/login  ^>  /identity/auth/login
echo   - /data/api/*               ^>  /data/*
echo   - /payment/api/*            ^>  /payment/*
echo   - /analytics/api/*          ^>  /analytics/*
echo.
echo [INFO] Frontend has been rebuilt with correct paths.
echo.
echo ========================================
echo Testing Backend Services...
echo ========================================
echo.

echo [1] Testing Eureka Server...
curl -s http://localhost:8761/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo [OK] Eureka is healthy
) else (
    echo [ERROR] Eureka not responding
)
echo.

echo [2] Testing API Gateway...
curl -s http://localhost:8080/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo [OK] API Gateway is healthy
) else (
    echo [ERROR] API Gateway not responding
)
echo.

echo [3] Testing Identity Service via Gateway...
curl -s http://localhost:8080/identity/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo [OK] Identity Service is healthy
) else (
    echo [ERROR] Identity Service not responding
)
echo.

echo ========================================
echo Testing Frontend + Nginx Proxy...
echo ========================================
echo.

echo [4] Testing Frontend is up...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost/ 2>nul
echo.

echo [5] Testing Nginx proxy to Identity Service...
curl -s http://localhost/identity/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo [OK] Nginx proxy is working
) else (
    echo [ERROR] Nginx proxy not working
)
echo.

echo ========================================
echo Testing LOGIN API (FIXED PATHS)
echo ========================================
echo.

echo [6] Test Login with ADMIN credentials...
echo Request: POST http://localhost/identity/auth/login
echo.
curl -X POST http://localhost/identity/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@evdata.com\",\"password\":\"admin123\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" 2>nul

echo.
echo ========================================
echo Summary
echo ========================================
echo.
echo If you see:
echo   - HTTP Status: 200
echo   - A JSON response with "accessToken" and "refreshToken"
echo.
echo Then LOGIN IS WORKING! ✓
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Open browser: http://localhost
echo 2. Try to login with:
echo    Email: admin@evdata.com
echo    Password: admin123
echo.
echo 3. If login successful, you will be redirected to dashboard
echo.
echo 4. Check browser console (F12) for any errors
echo.
echo ========================================
echo.

choice /C YN /M "Open browser now"
if errorlevel 2 goto end
if errorlevel 1 (
    start http://localhost
    echo Browser opened!
)

:end
echo.
pause

