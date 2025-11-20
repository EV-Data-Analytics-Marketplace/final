@echo off
echo Testing EV Platform Services...
echo.

echo === EUREKA SERVER ===
docker logs ev-eureka-server --tail 3 2>&1 | findstr "Started"
echo.

echo === API GATEWAY ===
docker logs ev-api-gateway --tail 3 2>&1 | findstr "Started"
echo.

echo === IDENTITY SERVICE ===
docker logs ev-identity-service --tail 3 2>&1 | findstr "Started"
echo.

echo === DATA SERVICE ===
docker logs ev-data-service --tail 3 2>&1 | findstr "Started"
echo.

echo === PAYMENT SERVICE ===
docker logs ev-payment-service --tail 3 2>&1 | findstr "Started"
echo.

echo === ANALYTICS SERVICE ===
docker logs ev-analytics-service --tail 3 2>&1 | findstr "Started"
echo.

echo === CONTAINER STATUS ===
docker ps --format "table {{.Names}}\t{{.Status}}" | findstr "ev-"
echo.

echo.
echo === TEST API ===
echo Testing Identity Service...
curl -X GET http://localhost:8080/identity/actuator/health 2>nul
echo.
echo.

echo Testing Frontend Nginx Proxy...
curl -X GET http://localhost/identity/actuator/health 2>nul
echo.
echo.

pause

