@echo off
echo ========================================
echo EV Platform - Login Test
echo ========================================
echo.

echo [1] Testing API Gateway Health...
curl -s http://localhost:8080/actuator/health
echo.
echo.

echo [2] Testing Identity Service Health via API Gateway...
curl -s http://localhost:8080/identity/actuator/health
echo.
echo.

echo [3] Testing Identity Service Health via Frontend Nginx...
curl -s http://localhost/identity/actuator/health
echo.
echo.

echo [4] Testing Login API (via Frontend Nginx)...
curl -X POST http://localhost/identity/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}" ^
  -w "\nHTTP Status: %%{http_code}\n"
echo.
echo.

echo [5] Testing Login API (via API Gateway)...
curl -X POST http://localhost:8080/identity/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}" ^
  -w "\nHTTP Status: %%{http_code}\n"
echo.
echo.

echo ========================================
echo Test Complete
echo ========================================
echo.
echo If you see HTTP Status: 200 and a JWT token,
echo the login is working correctly!
echo.
echo Open your browser at http://localhost
echo and try to login with the credentials above.
echo.
pause

