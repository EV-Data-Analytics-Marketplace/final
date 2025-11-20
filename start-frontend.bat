@echo off
echo ===============================================
echo    EV Platform - Frontend Startup
echo ===============================================
echo.

cd ev-frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo.
    echo node_modules not found. Installing dependencies...
    echo This may take a few minutes...
    call npm install
) else (
    echo node_modules found. Skipping installation.
)

echo.
echo ===============================================
echo    Starting Frontend Development Server
echo ===============================================
echo.
echo   Frontend will be available at:
echo   http://localhost:3000
echo.
echo   Press Ctrl+C to stop the server
echo ===============================================
echo.

call npm run dev

