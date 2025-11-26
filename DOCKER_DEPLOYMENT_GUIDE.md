# Hướng Dẫn Deploy Dự Án EV lên Docker

## Mục Lục
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
- [Chuẩn Bị](#chuẩn-bị)
- [Phương Pháp Deploy](#phương-pháp-deploy)
  - [Phương Pháp 1: Deploy Nhanh (Khuyến Nghị)](#phương-pháp-1-deploy-nhanh-khuyến-nghị)
  - [Phương Pháp 2: Deploy Thông Thường](#phương-pháp-2-deploy-thông-thường)
- [Kiểm Tra Deployment](#kiểm-tra-deployment)
- [Quản Lý Containers](#quản-lý-containers)
- [Troubleshooting](#troubleshooting)
- [Ports và Services](#ports-và-services)

---

## Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết
- **Docker Desktop**: Phiên bản 20.10 trở lên
- **Docker Compose**: Phiên bản 2.x trở lên
- **Java JDK**: 17 trở lên (để build JAR files)
- **Node.js**: 18 trở lên (cho frontend)
- **Maven**: 3.9 trở lên (hoặc sử dụng Maven Wrapper đã có sẵn)

### Tài Nguyên Hệ Thống
- **RAM**: Tối thiểu 8GB (Khuyến nghị 16GB)
- **Disk Space**: Tối thiểu 10GB trống
- **CPU**: 4 cores trở lên

---

## Kiến Trúc Hệ Thống

Dự án bao gồm các services sau:

### Backend Services (Spring Boot + Java 17)
1. **Eureka Server** - Service Discovery (Port 8761)
2. **API Gateway** - API Gateway (Port 8080)
3. **Identity Service** - Authentication & Authorization (Port 8081)
4. **Data Service** - Data Management (Port 8082)
5. **Payment Service** - Payment Processing (Port 8083)
6. **Analytics Service** - Analytics & Reporting (Port 8084)

### Frontend
7. **EV Frontend** - React Application (Port 80)

### Databases (MySQL 8.0)
8. **Identity DB** - Port 3307
9. **Data DB** - Port 3308
10. **Payment DB** - Port 3309
11. **Analytics DB** - Port 3310

---

## Chuẩn Bị

### 1. Clone Repository
```bash
git clone <repository-url>
cd EV
```

### 2. Kiểm Tra Docker
```bash
docker --version
docker compose version
```

### 3. Cấu Hình Environment Variables
Kiểm tra file `docker-compose.yml` và cập nhật các biến môi trường nếu cần:
- JWT_SECRET
- Database passwords
- Service URLs

---

## Phương Pháp Deploy

### Phương Pháp 1: Deploy Nhanh (Khuyến Nghị)

Phương pháp này build JAR files trước, sau đó đóng gói vào Docker. **Nhanh hơn 5-10 lần** so với phương pháp thông thường.

#### Bước 1: Build tất cả JAR files

**Trên Windows (PowerShell):**
```powershell
# Build Eureka Server
cd eureka-server
.\mvnw.cmd clean package -DskipTests
cd ..

# Build API Gateway
cd api-gateway
.\mvnw.cmd clean package -DskipTests
cd ..

# Build Identity Service
cd identity-service
.\mvnw.cmd clean package -DskipTests
cd ..

# Build Data Service
cd data-service
.\mvnw.cmd clean package -DskipTests
cd ..

# Build Payment Service
cd payment-service
.\mvnw.cmd clean package -DskipTests
cd ..

# Build Analytics Service
cd analytics-service
.\mvnw.cmd clean package -DskipTests
cd ..
```

**Trên Linux/Mac:**
```bash
# Build tất cả services
for service in eureka-server api-gateway identity-service data-service payment-service analytics-service; do
    cd $service
    ./mvnw clean package -DskipTests
    cd ..
done
```

#### Bước 2: Verify JAR files đã được tạo
```powershell
# Windows PowerShell
Get-ChildItem -Path .\*\target\*.jar -Recurse | Where-Object { $_.Name -notlike "*.original" }
```

```bash
# Linux/Mac
find . -path "*/target/*.jar" ! -name "*.original"
```

Bạn sẽ thấy các file:
- eureka-server/target/eureka-server-1.0.0.jar
- api-gateway/target/api-gateway-1.0.0.jar
- identity-service/target/identity-service-1.0.0.jar
- data-service/target/data-service-1.0.0.jar
- payment-service/target/payment-service-1.0.0.jar
- analytics-service/target/analytics-service-1.0.0.jar

#### Bước 3: Deploy lên Docker
```bash
docker compose up -d --build
```

**Thời gian build Docker images:** ~2-3 phút (so với 10-15 phút khi build trong Docker)

---

### Phương Pháp 2: Deploy Thông Thường

Phương pháp này build trực tiếp trong Docker. Chậm hơn nhưng đơn giản.

#### Bước 1: Restore Dockerfile gốc (nếu đã thay đổi)

Đảm bảo các Dockerfile có cấu trúc multi-stage build:

```dockerfile
# Ví dụ: eureka-server/Dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY settings.xml /root/.m2/settings.xml
COPY src ./src
RUN mvn clean package -Dmaven.test.skip=true -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/eureka-server-1.0.0.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Bước 2: Deploy
```bash
docker compose up -d --build
```

**Thời gian:** ~10-15 phút cho lần đầu tiên

---

## Kiểm Tra Deployment

### 1. Kiểm Tra Trạng Thái Containers
```bash
docker compose ps
```

Kết quả mong đợi: Tất cả containers có status **Up** hoặc **Up (healthy)**

### 2. Kiểm Tra Logs

**Xem logs của một service:**
```bash
docker logs ev-eureka-server
docker logs ev-api-gateway
docker logs ev-identity-service
```

**Xem logs real-time:**
```bash
docker logs -f ev-eureka-server
```

**Xem logs của tất cả services:**
```bash
docker compose logs
```

### 3. Kiểm Tra Health Endpoints

#### Eureka Server
```bash
curl http://localhost:8761
# Hoặc mở browser: http://localhost:8761
```

#### API Gateway
```bash
curl http://localhost:8080/actuator/health
```

#### Identity Service
```bash
curl http://localhost:8081/actuator/health
```

#### Data Service
```bash
curl http://localhost:8082/actuator/health
```

#### Payment Service
```bash
curl http://localhost:8083/actuator/health
```

#### Analytics Service
```bash
curl http://localhost:8084/actuator/health
```

#### Frontend
```bash
curl http://localhost
# Hoặc mở browser: http://localhost
```

### 4. Kiểm Tra Database Connections

```bash
# Identity Database
docker exec -it ev-identity-mysql mysql -uroot -proot123 -e "SHOW DATABASES;"

# Data Database
docker exec -it ev-data-mysql mysql -uroot -proot123 -e "SHOW DATABASES;"

# Payment Database
docker exec -it ev-payment-mysql mysql -uroot -proot123 -e "SHOW DATABASES;"

# Analytics Database
docker exec -it ev-analytics-mysql mysql -uroot -proot123 -e "SHOW DATABASES;"
```

---

## Quản Lý Containers

### Dừng tất cả services
```bash
docker compose down
```

### Dừng và xóa volumes (Reset database)
```bash
docker compose down -v
```

### Restart một service cụ thể
```bash
docker compose restart identity-service
```

### Xem resource usage
```bash
docker stats
```

### Rebuild một service cụ thể
```bash
docker compose up -d --build identity-service
```

### Xem network
```bash
docker network ls
docker network inspect ev_ev-network
```

### Scale services (nếu cần)
```bash
docker compose up -d --scale data-service=2
```

---

## Troubleshooting

### Vấn Đề 1: Container liên tục restart

**Kiểm tra logs:**
```bash
docker logs <container-name>
```

**Nguyên nhân thường gặp:**
- Database chưa sẵn sàng → Chờ thêm vài giây
- Port conflict → Kiểm tra port đã được sử dụng chưa
- Out of memory → Tăng memory cho Docker Desktop

### Vấn Đề 2: Service không kết nối được database

**Kiểm tra:**
```bash
# Xem logs database
docker logs ev-identity-mysql

# Kiểm tra network
docker network inspect ev_ev-network

# Test connection từ service container
docker exec -it ev-identity-service ping mysql-identity
```

**Giải pháp:**
- Đảm bảo database đã healthy: `docker compose ps`
- Restart service: `docker compose restart identity-service`

### Vấn Đề 3: Eureka Server unhealthy

**Kiểm tra:**
```bash
docker logs ev-eureka-server
curl http://localhost:8761
```

**Giải pháp:**
- Đợi 2-3 phút để Eureka khởi động hoàn toàn
- Restart: `docker compose restart eureka-server`

### Vấn Đề 4: Frontend không load được

**Kiểm tra:**
```bash
docker logs ev-frontend
```

**Giải pháp:**
- Verify build: `cd ev-frontend && npm run build`
- Kiểm tra nginx config: `docker exec -it ev-frontend cat /etc/nginx/conf.d/default.conf`

### Vấn Đề 5: Port conflicts

**Lỗi:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

**Giải pháp:**
```bash
# Windows - Tìm process đang dùng port
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080

# Kill process hoặc thay đổi port trong docker-compose.yml
```

### Vấn Đề 6: Out of disk space

**Giải pháp:**
```bash
# Xóa unused images
docker image prune -a

# Xóa unused volumes
docker volume prune

# Xóa everything unused
docker system prune -a --volumes
```

### Vấn Đề 7: Build quá chậm

**Giải pháp:**
- Sử dụng [Phương Pháp 1: Deploy Nhanh](#phương-pháp-1-deploy-nhanh-khuyến-nghị)
- Tăng resources cho Docker Desktop (Settings → Resources)
- Enable BuildKit: `export DOCKER_BUILDKIT=1`

---

## Ports và Services

| Service | Container Name | Port | URL | Description |
|---------|---------------|------|-----|-------------|
| Eureka Server | ev-eureka-server | 8761 | http://localhost:8761 | Service Discovery Dashboard |
| API Gateway | ev-api-gateway | 8080 | http://localhost:8080 | API Gateway |
| Identity Service | ev-identity-service | 8081 | http://localhost:8081 | Authentication & Users |
| Data Service | ev-data-service | 8082 | http://localhost:8082 | Data Management |
| Payment Service | ev-payment-service | 8083 | http://localhost:8083 | Payment Processing |
| Analytics Service | ev-analytics-service | 8084 | http://localhost:8084 | Analytics & Reports |
| Frontend | ev-frontend | 80 | http://localhost | React Web App |
| Identity MySQL | ev-identity-mysql | 3307 | localhost:3307 | Identity Database |
| Data MySQL | ev-data-mysql | 3308 | localhost:3308 | Data Database |
| Payment MySQL | ev-payment-mysql | 3309 | localhost:3309 | Payment Database |
| Analytics MySQL | ev-analytics-mysql | 3310 | localhost:3310 | Analytics Database |

---

## Script Tự Động Deploy

### Windows PowerShell Script

Tạo file `deploy.ps1`:

```powershell
# deploy.ps1
Write-Host "=== EV Project Docker Deployment ===" -ForegroundColor Green

# Build JAR files
Write-Host "`n[1/3] Building JAR files..." -ForegroundColor Yellow
$services = @("eureka-server", "api-gateway", "identity-service", "data-service", "payment-service", "analytics-service")

foreach ($service in $services) {
    Write-Host "Building $service..." -ForegroundColor Cyan
    Set-Location $service
    .\mvnw.cmd clean package -DskipTests -q
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to build $service" -ForegroundColor Red
        exit 1
    }
    Set-Location ..
}

# Verify JARs
Write-Host "`n[2/3] Verifying JAR files..." -ForegroundColor Yellow
$jars = Get-ChildItem -Path .\*\target\*.jar -Recurse | Where-Object { $_.Name -notlike "*.original" }
Write-Host "Found $($jars.Count) JAR files" -ForegroundColor Green

# Deploy to Docker
Write-Host "`n[3/3] Deploying to Docker..." -ForegroundColor Yellow
docker compose down
docker compose up -d --build

# Wait and check status
Write-Host "`nWaiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "`n=== Deployment Status ===" -ForegroundColor Green
docker compose ps

Write-Host "`n=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Cyan
```

**Chạy script:**
```powershell
.\deploy.ps1
```

### Linux/Mac Bash Script

Tạo file `deploy.sh`:

```bash
#!/bin/bash

echo "=== EV Project Docker Deployment ==="

# Build JAR files
echo -e "\n[1/3] Building JAR files..."
services=("eureka-server" "api-gateway" "identity-service" "data-service" "payment-service" "analytics-service")

for service in "${services[@]}"; do
    echo "Building $service..."
    cd "$service"
    ./mvnw clean package -DskipTests -q
    if [ $? -ne 0 ]; then
        echo "Failed to build $service"
        exit 1
    fi
    cd ..
done

# Verify JARs
echo -e "\n[2/3] Verifying JAR files..."
jar_count=$(find . -path "*/target/*.jar" ! -name "*.original" | wc -l)
echo "Found $jar_count JAR files"

# Deploy to Docker
echo -e "\n[3/3] Deploying to Docker..."
docker compose down
docker compose up -d --build

# Wait and check status
echo -e "\nWaiting for services to start..."
sleep 30

echo -e "\n=== Deployment Status ==="
docker compose ps

echo -e "\n=== Deployment Complete! ==="
echo "Eureka Dashboard: http://localhost:8761"
echo "Frontend: http://localhost"
echo "API Gateway: http://localhost:8080"
```

**Chạy script:**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Backup và Restore

### Backup Databases

```bash
# Backup Identity DB
docker exec ev-identity-mysql mysqldump -uroot -proot123 ev_identity_db > backup_identity_$(date +%Y%m%d).sql

# Backup Data DB
docker exec ev-data-mysql mysqldump -uroot -proot123 ev_data_db > backup_data_$(date +%Y%m%d).sql

# Backup Payment DB
docker exec ev-payment-mysql mysqldump -uroot -proot123 ev_payment_db > backup_payment_$(date +%Y%m%d).sql

# Backup Analytics DB
docker exec ev-analytics-mysql mysqldump -uroot -proot123 ev_analytics_db > backup_analytics_$(date +%Y%m%d).sql
```

### Restore Databases

```bash
# Restore Identity DB
docker exec -i ev-identity-mysql mysql -uroot -proot123 ev_identity_db < backup_identity_20251126.sql

# Restore Data DB
docker exec -i ev-data-mysql mysql -uroot -proot123 ev_data_db < backup_data_20251126.sql

# Restore Payment DB
docker exec -i ev-payment-mysql mysql -uroot -proot123 ev_payment_db < backup_payment_20251126.sql

# Restore Analytics DB
docker exec -i ev-analytics-mysql mysql -uroot -proot123 ev_analytics_db < backup_analytics_20251126.sql
```

---

## Production Deployment Notes

### 1. Environment Variables
- Đổi tất cả mật khẩu mặc định
- Sử dụng secrets management (Docker Secrets, HashiCorp Vault)
- Cấu hình JWT_SECRET phức tạp hơn

### 2. Resource Limits
Thêm resource limits vào `docker-compose.yml`:

```yaml
services:
  identity-service:
    # ...existing config...
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 3. Logging
Cấu hình log driver:

```yaml
services:
  identity-service:
    # ...existing config...
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 4. Health Checks
Đã được cấu hình cho databases. Nên thêm cho các services khác.

### 5. SSL/TLS
Sử dụng reverse proxy (Nginx, Traefik) với Let's Encrypt cho production.

---

## Monitoring và Logging

### 1. View logs của tất cả services
```bash
docker compose logs -f
```

### 2. Filter logs theo service
```bash
docker compose logs -f identity-service
```

### 3. Export logs
```bash
docker compose logs > deployment_logs_$(date +%Y%m%d).log
```

### 4. Monitor resources
```bash
docker stats
```

---

## Tài Liệu Tham Khảo

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Documentation](https://spring.io/guides/gs/spring-boot-docker/)
- [MySQL Docker Documentation](https://hub.docker.com/_/mysql)

---

## Support

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs: `docker compose logs`
2. Kiểm tra status: `docker compose ps`
3. Xem phần [Troubleshooting](#troubleshooting)
4. Tạo issue trên GitHub repository

---

**Cập nhật lần cuối:** 26/11/2025
**Phiên bản:** 1.0.0

