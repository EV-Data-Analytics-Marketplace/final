@echo off
echo ========================================
echo Payment Service - Quick Start
echo ========================================
echo.

echo [1/4] Checking MySQL...
mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS ev_payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: MySQL is not running or credentials are wrong
    echo Please start MySQL and try again
    pause
    exit /b 1
)
echo MySQL OK - Database ready
echo.

echo [2/4] Stopping existing Java processes...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Done
echo.

echo [3/4] Building service...
call mvn clean package -DskipTests -q
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo Build successful
echo.

echo [4/4] Starting Payment Service...
echo Service will start on http://localhost:8083/payment
echo Press Ctrl+C to stop the service
echo.
java -jar target\payment-service-1.0.0.jar

