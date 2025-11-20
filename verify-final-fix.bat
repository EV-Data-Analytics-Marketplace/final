@echo off
cls
echo ========================================
echo FINAL LOGIN FIX - Verification
echo ========================================
echo.
echo This script will verify all fixes are working.
echo.
pause

echo.
echo [Step 1] Checking if frontend container is running...
docker ps --filter "name=ev-frontend" --format "{{.Names}} - {{.Status}}"

echo.
echo [Step 2] Checking environment variable in running container...
docker exec ev-frontend sh -c "cat /usr/share/nginx/html/assets/index*.js | grep -o 'http://localhost[^\"]*' | head -1"

echo.
echo [Step 3] Testing frontend accessibility...
curl -s -o nul -w "Frontend HTTP Status: %%{http_code}\n" http://localhost/

echo.
echo [Step 4] Testing Nginx proxy to Identity...
curl -s -o nul -w "Identity Health HTTP Status: %%{http_code}\n" http://localhost/identity/actuator/health

echo.
echo [Step 5] Testing LOGIN API...
echo.
echo Request: POST http://localhost/identity/auth/login
echo Credentials: admin@evdata.com / admin123
echo.
curl -X POST http://localhost/identity/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@evdata.com\",\"password\":\"admin123\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  -v 2>&1 | findstr /C:"POST" /C:"HTTP" /C:"accessToken"

echo.
echo ========================================
echo Browser Testing Instructions
echo ========================================
echo.
echo 1. Open http://localhost in your browser
echo 2. Open DevTools (F12) - Network tab
echo 3. Clear browser cache (Ctrl+Shift+Delete)
echo 4. Hard reload (Ctrl+Shift+R)
echo 5. Try to login:
echo    Email: admin@evdata.com
echo    Password: admin123
echo.
echo 6. In Network tab, check the login request:
echo    ✓ Request URL: http://localhost/identity/auth/login
echo    ✓ Status: 200 OK
echo    ✓ Response has accessToken and refreshToken
echo.
echo If you see HTTP 401, the issue is NOT with frontend code.
echo Check backend service logs:
echo    docker logs ev-identity-service
echo    docker logs ev-api-gateway
echo.

choice /C YN /M "Open browser now to test"
if errorlevel 2 goto end
start http://localhost
echo.
echo Browser opened! Remember to:
echo 1. Press Ctrl+Shift+R (hard reload)
echo 2. Open DevTools (F12)
echo 3. Check Network tab when logging in
echo.

:end
pause

