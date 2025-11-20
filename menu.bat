@echo off
:menu
cls
echo ========================================
echo    EV Platform Management Menu
echo ========================================
echo.
echo 1. Quick Deploy (Recommended)
echo 2. Rebuild All (Clean deployment)
echo 3. Check Service Status
echo 4. Test Deployment
echo 5. Test Login API
echo 6. View Eureka Dashboard
echo 7. View Frontend
echo 8. View Logs (Interactive)
echo 9. Stop All Services
echo 0. Exit
echo.
echo ========================================
set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto quick_deploy
if "%choice%"=="2" goto rebuild
if "%choice%"=="3" goto status
if "%choice%"=="4" goto test_deploy
if "%choice%"=="5" goto test_login
if "%choice%"=="6" goto eureka
if "%choice%"=="7" goto frontend
if "%choice%"=="8" goto logs
if "%choice%"=="9" goto stop
if "%choice%"=="0" goto exit
goto menu

:quick_deploy
cls
echo Running Quick Deploy...
call quick-deploy.bat
pause
goto menu

:rebuild
cls
echo Rebuilding All Services...
call rebuild-all.bat
pause
goto menu

:status
cls
call status.bat
pause
goto menu

:test_deploy
cls
call test-deployment.bat
pause
goto menu

:test_login
cls
call test-login.bat
pause
goto menu

:eureka
cls
echo Opening Eureka Dashboard...
start http://localhost:8761
echo Eureka Dashboard opened in browser.
timeout /t 2
goto menu

:frontend
cls
echo Opening Frontend...
start http://localhost
echo Frontend opened in browser.
timeout /t 2
goto menu

:logs
cls
echo ========================================
echo Select Service to View Logs:
echo ========================================
echo.
echo 1. Eureka Server
echo 2. API Gateway
echo 3. Identity Service
echo 4. Data Service
echo 5. Payment Service
echo 6. Analytics Service
echo 7. Frontend
echo 8. All MySQL Databases
echo 0. Back to Main Menu
echo.
set /p log_choice="Enter choice: "

if "%log_choice%"=="1" docker logs -f ev-eureka-server
if "%log_choice%"=="2" docker logs -f ev-api-gateway
if "%log_choice%"=="3" docker logs -f ev-identity-service
if "%log_choice%"=="4" docker logs -f ev-data-service
if "%log_choice%"=="5" docker logs -f ev-payment-service
if "%log_choice%"=="6" docker logs -f ev-analytics-service
if "%log_choice%"=="7" docker logs -f ev-frontend
if "%log_choice%"=="8" goto show_db_logs
if "%log_choice%"=="0" goto menu
pause
goto menu

:show_db_logs
echo.
echo === Identity MySQL ===
docker logs ev-identity-mysql --tail 20
echo.
echo === Data MySQL ===
docker logs ev-data-mysql --tail 20
echo.
echo === Payment MySQL ===
docker logs ev-payment-mysql --tail 20
echo.
echo === Analytics MySQL ===
docker logs ev-analytics-mysql --tail 20
pause
goto menu

:stop
cls
echo Stopping All Services...
call stop-all.bat
pause
goto menu

:exit
cls
echo.
echo Thank you for using EV Platform!
echo.
timeout /t 2
exit

