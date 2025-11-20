@echo off
echo ========================================
echo EV Platform - Service Status
echo ========================================
echo.
docker-compose ps
echo.
echo ========================================
echo To view logs of a specific service:
echo   docker-compose logs -f [service-name]
echo.
echo Service names:
echo   - eureka-server
echo   - api-gateway
echo   - identity-service
echo   - data-service
echo   - payment-service
echo   - analytics-service
echo   - ev-frontend
echo   - mysql-identity
echo   - mysql-data
echo   - mysql-payment
echo   - mysql-analytics
echo ========================================

