# EV Platform - Deployment Guide

## Tổng Quan
Hệ thống EV Platform bao gồm:
- **Frontend**: React app chạy trên port 80 (Nginx)
- **API Gateway**: Cổng API chính - port 8080
- **Eureka Server**: Service Discovery - port 8761
- **Identity Service**: Xác thực & phân quyền - port 8081
- **Data Service**: Quản lý dữ liệu - port 8082
- **Payment Service**: Thanh toán - port 8083
- **Analytics Service**: Phân tích - port 8084
- **MySQL Databases**: 4 databases cho các services (ports 3307-3310)

## Cấu Hình Quan Trọng

### Frontend Configuration
File: `ev-frontend\.env`
```
VITE_API_GATEWAY_URL=http://localhost
```

**LƯU Ý**: Frontend chạy trong Docker sử dụng Nginx làm reverse proxy.
- Truy cập từ browser: `http://localhost`
- Nginx tự động proxy các API requests đến API Gateway (port 8080)
- Các route API:
  - `/identity/*` → `http://api-gateway:8080/identity/*`
  - `/data/*` → `http://api-gateway:8080/data/*`
  - `/payment/*` → `http://api-gateway:8080/payment/*`
  - `/analytics/*` → `http://api-gateway:8080/analytics/*`

### Nginx Configuration
File: `ev-frontend\nginx.conf` đã được cấu hình sẵn để:
- Serve React app trên port 80
- Proxy tất cả API requests đến api-gateway:8080
- Hỗ trợ React Router (SPA routing)

## Cách Deploy

### Option 1: Deploy Nhanh (Recommended)
```cmd
quick-deploy.bat
```
Script này sẽ:
1. Dừng và xóa containers cũ
2. Build lại tất cả services
3. Start databases trước
4. Start Eureka Server
5. Start các services còn lại
6. Mở Eureka Dashboard

### Option 2: Deploy Thủ Công

#### Bước 1: Dừng và xóa containers cũ
```cmd
docker-compose down -v
```

#### Bước 2: Build tất cả services
```cmd
docker-compose build --no-cache
```

#### Bước 3: Start theo thứ tự

**3.1. Start databases trước:**
```cmd
docker-compose up -d mysql-identity mysql-data mysql-payment mysql-analytics
```

**3.2. Đợi databases khởi động (30 giây):**
```cmd
timeout /t 30
```

**3.3. Start Eureka Server:**
```cmd
docker-compose up -d eureka-server
```

**3.4. Đợi Eureka Server (20 giây):**
```cmd
timeout /t 20
```

**3.5. Start tất cả services còn lại:**
```cmd
docker-compose up -d
```

#### Bước 4: Kiểm tra trạng thái
```cmd
docker-compose ps
```

### Option 3: Rebuild Toàn Bộ
```cmd
rebuild-all.bat
```

## Kiểm Tra Services

### Xem Logs
```cmd
# Xem logs của một service
docker logs ev-eureka-server
docker logs ev-api-gateway
docker logs ev-identity-service
docker logs ev-data-service
docker logs ev-payment-service
docker logs ev-analytics-service
docker logs ev-frontend

# Xem logs realtime
docker logs -f ev-identity-service

# Xem logs mới nhất
docker logs --tail 50 ev-identity-service
```

### Kiểm Tra Trạng Thái
```cmd
# Kiểm tra tất cả containers
docker ps -a

# Kiểm tra services EV Platform
docker ps -a | findstr "ev-"

# Sử dụng script
status.bat
```

### Kiểm Tra Health
```cmd
# Eureka Dashboard - xem tất cả services đã register
http://localhost:8761

# API Gateway health
curl http://localhost:8080/actuator/health

# Identity Service health
curl http://localhost:8081/actuator/health
```

## Truy Cập Ứng Dụng

### URLs
- **Frontend**: http://localhost
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Identity Service**: http://localhost:8081
- **Data Service**: http://localhost:8082
- **Payment Service**: http://localhost:8083
- **Analytics Service**: http://localhost:8084

### MySQL Databases
- **Identity DB**: localhost:3307
  - Database: `ev_identity_db`
  - User: `root`
  - Password: `root123`

- **Data DB**: localhost:3308
  - Database: `ev_data_db`
  - User: `root`
  - Password: `root123`

- **Payment DB**: localhost:3309
  - Database: `ev_payment_db`
  - User: `root`
  - Password: `root123`

- **Analytics DB**: localhost:3310
  - Database: `ev_analytics_db`
  - User: `root`
  - Password: `root123`

## Đăng Nhập Frontend

### Cách hoạt động:
1. Mở browser tại `http://localhost`
2. Frontend React app sẽ load
3. Khi đăng nhập, request sẽ đi qua Nginx
4. Nginx proxy đến `http://api-gateway:8080/identity/auth/login`
5. API Gateway route đến Identity Service
6. Identity Service xác thực và trả về JWT token
7. Frontend lưu token và sử dụng cho các requests tiếp theo

### Test Login API
```cmd
curl -X POST http://localhost/identity/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

## Troubleshooting

### 1. Không đăng nhập được
**Triệu chứng**: Login không thành công mặc dù services đang chạy

**Giải pháp**:
```cmd
# 1. Kiểm tra logs của Identity Service
docker logs ev-identity-service --tail 100

# 2. Kiểm tra database connection
docker exec -it ev-identity-mysql mysql -uroot -proot123 -e "USE ev_identity_db; SHOW TABLES;"

# 3. Kiểm tra Nginx proxy
docker logs ev-frontend --tail 50

# 4. Kiểm tra API Gateway routing
docker logs ev-api-gateway --tail 100

# 5. Test trực tiếp API Gateway
curl http://localhost:8080/identity/actuator/health
```

### 2. Services không start
**Triệu chứng**: Containers ở trạng thái "Created" hoặc "Exited"

**Giải pháp**:
```cmd
# Restart theo thứ tự
docker-compose down
docker-compose up -d mysql-identity mysql-data mysql-payment mysql-analytics
timeout /t 30
docker-compose up -d eureka-server
timeout /t 20
docker-compose up -d
```

### 3. Eureka Server không healthy
**Triệu chứng**: Services khác không start vì Eureka không ready

**Giải pháp**:
```cmd
# Xem logs
docker logs ev-eureka-server

# Restart Eureka
docker restart ev-eureka-server

# Đợi 30 giây
timeout /t 30

# Check health
curl http://localhost:8761/actuator/health
```

### 4. Frontend không connect được backend
**Triệu chứng**: 404 hoặc CORS errors trong browser console

**Giải pháp**:
```cmd
# 1. Kiểm tra .env
type ev-frontend\.env
# Phải là: VITE_API_GATEWAY_URL=http://localhost

# 2. Rebuild frontend
docker-compose build --no-cache ev-frontend
docker-compose up -d ev-frontend

# 3. Kiểm tra nginx config
docker exec ev-frontend cat /etc/nginx/conf.d/default.conf

# 4. Test proxy
curl http://localhost/identity/actuator/health
```

### 5. Database connection errors
**Triệu chứng**: Services không connect được database

**Giải pháp**:
```cmd
# Kiểm tra databases
docker ps -a | findstr mysql

# Restart databases
docker-compose restart mysql-identity mysql-data mysql-payment mysql-analytics

# Wait and check
timeout /t 10
docker-compose ps
```

## Dừng Hệ Thống

### Dừng tất cả services (giữ data)
```cmd
docker-compose stop
```

### Dừng và xóa containers (giữ data)
```cmd
docker-compose down
```

### Dừng và xóa tất cả (bao gồm data)
```cmd
docker-compose down -v
```

### Sử dụng script
```cmd
stop-all.bat
```

## Development Tips

### Rebuild một service cụ thể
```cmd
# Rebuild identity service
docker-compose build --no-cache identity-service
docker-compose up -d identity-service

# Xem logs
docker logs -f ev-identity-service
```

### Hot reload frontend (development mode)
```cmd
# Thay vì chạy trong Docker, chạy local:
cd ev-frontend
npm install
npm run dev

# Frontend sẽ chạy trên http://localhost:5173
# Cập nhật .env.development:
VITE_API_GATEWAY_URL=http://localhost:8080
```

### Connect database bằng MySQL client
```cmd
mysql -h 127.0.0.1 -P 3307 -u root -proot123 ev_identity_db
```

## Scripts Hữu Ích

- `quick-deploy.bat` - Deploy nhanh toàn bộ hệ thống
- `rebuild-all.bat` - Rebuild và deploy từ đầu
- `status.bat` - Xem trạng thái services
- `check-services.bat` - Kiểm tra services có start thành công không
- `stop-all.bat` - Dừng tất cả services
- `start-backend.bat` - Start backend services
- `start-frontend.bat` - Start frontend

## Lưu Ý Quan Trọng

1. **Thứ tự khởi động quan trọng**: Databases → Eureka → Other Services
2. **Frontend sử dụng Nginx proxy**: Không connect trực tiếp đến port 8080
3. **JWT Secret**: Tất cả services phải dùng cùng JWT secret
4. **Eureka registration**: Đợi Eureka healthy trước khi start services khác
5. **Database initialization**: Schema tự động load từ `schema.sql` khi start lần đầu

## Monitoring

### Eureka Dashboard
Mở http://localhost:8761 để xem:
- Tất cả services đã registered
- Instance status (UP/DOWN)
- Service metadata

### Container Stats
```cmd
docker stats
```

### Network inspection
```cmd
docker network inspect ev_ev-network
```

