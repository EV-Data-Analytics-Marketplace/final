@echo off
echo ===============================================
echo    EV Platform - Stop All Services
echo ===============================================
echo.

echo Stopping all Docker containers...
docker-compose down

echo.
echo ===============================================
echo    All Services Stopped
echo ===============================================
echo.
echo To remove all data (databases), run:
echo   docker-compose down -v
echo.
pause

