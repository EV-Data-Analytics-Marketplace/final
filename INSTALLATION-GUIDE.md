# 📦 EV Platform - Hướng Dẫn Cài Đặt và Chạy

## 📋 Mục Lục
1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt Môi Trường](#cài-đặt-môi-trường)
3. [Clone và Setup Project](#clone-và-setup-project)
4. [Khởi Động Hệ Thống](#khởi-động-hệ-thống)
5. [Kiểm Tra và Test](#kiểm-tra-và-test)
6. [Troubleshooting](#troubleshooting)

---

## 🖥️ Yêu Cầu Hệ Thống

### Phần Cứng Tối Thiểu
- **CPU**: 4 cores (khuyến nghị 6-8 cores)
- **RAM**: 8GB (khuyến nghị 16GB)
- **Ổ cứng**: 10GB dung lượng trống
- **Hệ điều hành**: Windows 10/11, macOS, hoặc Linux

### Phần Mềm Cần Thiết

#### 1. Docker Desktop
- **Phiên bản**: 4.0 trở lên
- **Download**: https://www.docker.com/products/docker-desktop

**Kiểm tra cài đặt**:
```bash
docker --version
docker-compose --version
```

#### 2. Git
- **Phiên bản**: 2.0 trở lên
- **Download**: https://git-scm.com/downloads

**Kiểm tra cài đặt**:
```bash
git --version
```

#### 3. (Tùy chọn) Java Development Kit
- **Phiên bản**: JDK 17
- **Download**: https://adoptium.net/
- **Lưu ý**: Chỉ cần nếu muốn develop backend

#### 4. (Tùy chọn) Node.js
- **Phiên bản**: 18.x trở lên
- **Download**: https://nodejs.org/
- **Lưu ý**: Chỉ cần nếu muốn develop frontend

---

## ⚙️ Cài Đặt Môi Trường

### Bước 1: Cài Docker Desktop

#### Windows
1. Download Docker Desktop từ trang chính thức
2. Chạy file installer
3. Restart máy tính khi được yêu cầu
4. Mở Docker Desktop và đợi khởi động hoàn tất
5. Kiểm tra trong system tray (góc phải taskbar) có biểu tượng Docker

#### macOS
1. Download Docker Desktop cho Mac
2. Kéo Docker.app vào thư mục Applications
3. Mở Docker từ Applications
4. Cho phép các quyền khi được yêu cầu

#### Linux (Ubuntu/Debian)
```bash
# Cài Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Thêm user vào group docker
sudo usermod -aG docker $USER
```

### Bước 2: Cấu Hình Docker Desktop

1. Mở Docker Desktop
2. Vào **Settings** (⚙️)
3. Trong tab **Resources**:
   - **CPUs**: Chọn ít nhất 4 CPUs
   - **Memory**: Chọn ít nhất 6GB RAM
   - **Swap**: 2GB
   - **Disk image size**: 50GB

4. Trong tab **Docker Engine**:
   - Đảm bảo Docker daemon đang chạy

5. Click **Apply & Restart**

---

## 📥 Clone và Setup Project

### Bước 1: Clone Repository

```bash
# Tạo thư mục làm việc
mkdir -p ~/projects
cd ~/projects

# Clone project (thay YOUR_GIT_URL bằng URL thực tế)
git clone YOUR_GIT_URL ev-platform
cd ev-platform
```

**Hoặc nếu nhận project qua ZIP**:
```bash
# Giải nén file ZIP
unzip ev-platform.zip
cd ev-platform
```

### Bước 2: Kiểm Tra Cấu Trúc Project

```bash
# Xem cấu trúc thư mục
ls -la

# Bạn sẽ thấy:
# - analytics-service/
# - api-gateway/
# - data-service/
# - eureka-server/
# - ev-frontend/
# - identity-service/
# - payment-service/
# - docker-compose.yml
# - README.md
```

### Bước 3: Kiểm Tra File Cấu Hình

#### Kiểm tra `.env` của Frontend
```bash
# Windows
type ev-frontend\.env

# macOS/Linux
cat ev-frontend/.env
```

**Nội dung phải là**:
```env
VITE_API_GATEWAY_URL=http://localhost
```

#### Kiểm tra `.env.local` của Frontend
```bash
# Windows
type ev-frontend\.env.local

# macOS/Linux
cat ev-frontend/.env.local
```

**Nội dung phải là**:
```env
VITE_API_GATEWAY_URL=http://localhost
```

**⚠️ QUAN TRỌNG**: Nếu không có file `.env.local`, hãy tạo nó:
```bash
# Windows
echo VITE_API_GATEWAY_URL=http://localhost > ev-frontend\.env.local

# macOS/Linux
echo "VITE_API_GATEWAY_URL=http://localhost" > ev-frontend/.env.local
```

---

## 🚀 Khởi Động Hệ Thống

### Option 1: Sử Dụng Script Tự Động (Khuyến Nghị)

#### Windows
```cmd
# Chạy script deploy
quick-deploy.bat
```

#### macOS/Linux
```bash
# Tạo script nếu chưa có
cat > quick-deploy.sh << 'EOF'
#!/bin/bash
echo "========================================="
echo "   EV Platform - Quick Deploy"
echo "========================================="

echo "[1/5] Stopping existing containers..."
docker-compose down -v

echo "[2/5] Building services..."
docker-compose build --no-cache

echo "[3/5] Starting databases..."
docker-compose up -d mysql-identity mysql-data mysql-payment mysql-analytics
sleep 30

echo "[4/5] Starting Eureka Server..."
docker-compose up -d eureka-server
sleep 20

echo "[5/5] Starting all services..."
docker-compose up -d

echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Access URLs:"
echo "- Frontend:    http://localhost"
echo "- API Gateway: http://localhost:8080"
echo "- Eureka:      http://localhost:8761"
echo ""
echo "Login Credentials:"
echo "- Email:    admin@evdata.com"
echo "- Password: password"
EOF

chmod +x quick-deploy.sh
./quick-deploy.sh
```

### Option 2: Deploy Thủ Công Từng Bước

#### Bước 1: Dừng containers cũ (nếu có)
```bash
docker-compose down -v
```

#### Bước 2: Build tất cả services
```bash
docker-compose build --no-cache
```
**⏱️ Thời gian**: 15-20 phút lần đầu tiên

#### Bước 3: Start databases trước
```bash
docker-compose up -d mysql-identity mysql-data mysql-payment mysql-analytics
```

**⏱️ Đợi 30 giây** để databases khởi động:
```bash
# Windows
timeout /t 30

# macOS/Linux
sleep 30
```

#### Bước 4: Start Eureka Server
```bash
docker-compose up -d eureka-server
```

**⏱️ Đợi 20 giây** để Eureka khởi động:
```bash
# Windows
timeout /t 20

# macOS/Linux
sleep 20
```

#### Bước 5: Start tất cả services còn lại
```bash
docker-compose up -d
```

**⏱️ Đợi 30 giây** để tất cả services khởi động:
```bash
# Windows
timeout /t 30

# macOS/Linux
sleep 30
```

---

## ✅ Kiểm Tra và Test

### 1. Kiểm Tra Containers Đang Chạy

```bash
docker ps
```

**Bạn sẽ thấy 11 containers**:
- `ev-eureka-server` - Service Discovery
- `ev-api-gateway` - API Gateway
- `ev-identity-service` - Authentication Service
- `ev-data-service` - Data Management Service
- `ev-payment-service` - Payment Service
- `ev-analytics-service` - Analytics Service
- `ev-frontend` - React Frontend (Nginx)
- `ev-identity-mysql` - Identity Database
- `ev-data-mysql` - Data Database
- `ev-payment-mysql` - Payment Database
- `ev-analytics-mysql` - Analytics Database

### 2. Kiểm Tra Logs

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của service cụ thể
docker logs ev-identity-service
docker logs ev-frontend
```

**🟢 Dấu hiệu thành công**:
- Thấy "Started [ServiceName]Application" trong logs
- Không có ERROR màu đỏ
- Services đã register với Eureka

### 3. Kiểm Tra Eureka Dashboard

Mở browser và truy cập:
```
http://localhost:8761
```

**✅ Kiểm tra**:
- Phải thấy 5 services đã registered:
  - API-GATEWAY
  - IDENTITY-SERVICE
  - DATA-SERVICE
  - PAYMENT-SERVICE
  - ANALYTICS-SERVICE
- Tất cả có status **UP** (màu xanh)

### 4. Kiểm Tra Health Endpoints

```bash
# Eureka Server
curl http://localhost:8761/actuator/health

# API Gateway
curl http://localhost:8080/actuator/health

# Identity Service (via Gateway)
curl http://localhost:8080/identity/actuator/health
```

**✅ Response phải là**:
```json
{"status":"UP"}
```

### 5. Test Login API

```bash
# Windows (PowerShell)
$body = '{"email":"admin@evdata.com","password":"password"}'
Invoke-WebRequest -Uri "http://localhost/identity/api/auth/login" -Method POST -ContentType "application/json" -Body $body

# macOS/Linux
curl -X POST http://localhost/identity/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@evdata.com","password":"password"}'
```

**✅ Response phải chứa**:
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "tokenType": "Bearer",
  "user": {
    "email": "admin@evdata.com",
    "role": "ADMIN"
  }
}
```

### 6. Test Frontend

1. **Mở browser** và truy cập:
   ```
   http://localhost
   ```

2. **Clear cache** (quan trọng!):
   - Nhấn `Ctrl + Shift + Delete`
   - Chọn "Cached images and files"
   - Click "Clear data"

3. **Hard reload**:
   - Nhấn `Ctrl + Shift + R` (Chrome/Edge)
   - Hoặc `Ctrl + F5` (Firefox)

4. **Mở DevTools**:
   - Nhấn `F12`
   - Vào tab "Network"

5. **Login**:
   ```
   Email: admin@evdata.com
   Password: password
   ```

6. **Kiểm tra Network Tab**:
   - ✅ Request URL: `http://localhost/identity/api/auth/login`
   - ✅ Status: `200 OK`
   - ✅ Response có tokens
   - ✅ Redirect đến admin dashboard

---

## 🎯 Thông Tin Đăng Nhập

### Admin Account
```
Email: admin@evdata.com
Password: password
Role: ADMIN
```

**Quyền**:
- Toàn bộ hệ thống
- Quản lý users
- Xem tất cả datasets
- Xem analytics
- Quản lý payments

---

## 🌐 Service URLs

| Service | URL | Mô Tả |
|---------|-----|-------|
| **Frontend** | http://localhost | Giao diện React |
| **API Gateway** | http://localhost:8080 | REST API Gateway |
| **Eureka Dashboard** | http://localhost:8761 | Service Registry |
| **Identity Service** | http://localhost:8081 | Authentication (trực tiếp) |
| **Data Service** | http://localhost:8082 | Data Management (trực tiếp) |
| **Payment Service** | http://localhost:8083 | Payment Processing (trực tiếp) |
| **Analytics Service** | http://localhost:8084 | Analytics (trực tiếp) |

### Database Ports
| Database | Port | Username | Password | Database Name |
|----------|------|----------|----------|---------------|
| Identity | 3307 | root | root123 | ev_identity_db |
| Data | 3308 | root | root123 | ev_data_db |
| Payment | 3309 | root | root123 | ev_payment_db |
| Analytics | 3310 | root | root123 | ev_analytics_db |

---

## 🛑 Dừng Hệ Thống

### Dừng tất cả services (giữ data)
```bash
docker-compose stop
```

### Dừng và xóa containers (giữ data)
```bash
docker-compose down
```

### Dừng và xóa tất cả (bao gồm data)
```bash
docker-compose down -v
```

**⚠️ Cảnh báo**: Lệnh cuối sẽ xóa tất cả dữ liệu trong database!

---

## 🔧 Troubleshooting

### Vấn Đề 1: Docker Desktop không khởi động

**Triệu chứng**: 
- Docker Desktop icon không hiện trong system tray
- Lỗi "Docker daemon is not running"

**Giải pháp**:
```bash
# Windows
# 1. Mở Task Manager (Ctrl+Shift+Esc)
# 2. Tìm "Docker Desktop" và End Task
# 3. Khởi động lại Docker Desktop từ Start Menu

# macOS
# 1. Force quit Docker Desktop
# 2. Mở lại từ Applications

# Linux
sudo systemctl restart docker
```

### Vấn Đề 2: Port đã được sử dụng

**Triệu chứng**:
```
Error: bind: address already in use
```

**Giải pháp**:
```bash
# Windows
netstat -ano | findstr :80
netstat -ano | findstr :8080

# macOS/Linux
lsof -i :80
lsof -i :8080

# Kill process đang dùng port
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### Vấn Đề 3: Build quá lâu hoặc bị lỗi

**Triệu chứng**:
- Build bị timeout
- Lỗi "failed to download dependencies"

**Giải pháp**:
```bash
# 1. Tăng timeout trong Docker Desktop Settings
# 2. Retry build từng service:

docker-compose build eureka-server
docker-compose build api-gateway
docker-compose build identity-service
docker-compose build data-service
docker-compose build payment-service
docker-compose build analytics-service
docker-compose build ev-frontend
```

### Vấn Đề 4: Eureka Server unhealthy

**Triệu chứng**:
```
dependency failed to start: container ev-eureka-server is unhealthy
```

**Giải pháp**:
```bash
# 1. Kiểm tra logs
docker logs ev-eureka-server

# 2. Restart Eureka
docker restart ev-eureka-server

# 3. Đợi 30 giây
sleep 30

# 4. Start các services khác
docker-compose up -d
```

### Vấn Đề 5: Database connection error

**Triệu chứng**:
- Service logs có lỗi "Connection refused"
- "Communications link failure"

**Giải pháp**:
```bash
# 1. Kiểm tra databases đang chạy
docker ps | grep mysql

# 2. Restart databases
docker-compose restart mysql-identity mysql-data mysql-payment mysql-analytics

# 3. Đợi databases khởi động
sleep 30

# 4. Restart services
docker-compose restart identity-service data-service payment-service analytics-service
```

### Vấn Đề 6: Frontend không load

**Triệu chứng**:
- Browser hiện "Cannot GET /"
- 404 Not Found

**Giải pháp**:
```bash
# 1. Kiểm tra container
docker logs ev-frontend

# 2. Rebuild frontend
docker-compose build --no-cache ev-frontend
docker-compose up -d ev-frontend

# 3. Clear browser cache
# Ctrl+Shift+Delete → Clear data

# 4. Hard reload
# Ctrl+Shift+R
```

### Vấn Đề 7: Login trả về 401

**Triệu chứng**:
- Login failed với "Invalid email or password"
- Status 401 Unauthorized

**Giải pháp**:

1. **Kiểm tra password**:
   ```
   Email: admin@evdata.com
   Password: password
   ```
   ⚠️ Chú ý: Password là `password`, KHÔNG phải `admin123`

2. **Kiểm tra request URL**:
   - Mở DevTools (F12)
   - Tab Network
   - Request phải là: `http://localhost/identity/api/auth/login`
   - KHÔNG phải: `http://localhost:8080/...`

3. **Update password trong database** (nếu cần):
   ```bash
   # Tạo file update-password.sql
   cat > update-password.sql << 'EOF'
   UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@evdata.com';
   EOF

   # Apply vào database
   # Windows
   Get-Content update-password.sql | docker exec -i ev-identity-mysql mysql -uroot -proot123 ev_identity_db

   # macOS/Linux
   docker exec -i ev-identity-mysql mysql -uroot -proot123 ev_identity_db < update-password.sql
   ```

### Vấn Đề 8: Out of memory

**Triệu chứng**:
- Docker Desktop crash
- Services bị killed

**Giải pháp**:
1. Mở Docker Desktop Settings
2. Resources → Tăng Memory lên 8GB
3. Apply & Restart
4. Deploy lại

### Vấn Đề 9: Không thấy services trong Eureka

**Triệu chứng**:
- Eureka Dashboard không hiện services
- Services không register

**Giải pháp**:
```bash
# 1. Kiểm tra network
docker network ls | grep ev

# 2. Recreate network
docker-compose down
docker network rm ev_ev-network
docker-compose up -d

# 3. Kiểm tra logs của services
docker logs ev-identity-service | grep eureka
```

---

## ��� Tài Liệu Tham Khảo

| File | Mô Tả |
|------|-------|
| **SUCCESS.md** | Chi tiết về login fix và cấu hình |
| **OPTION1-SOLUTION.md** | Giải thích architecture và API paths |
| **DEPLOYMENT-GUIDE.md** | Hướng dẫn deploy chi tiết |
| **README.md** | Tổng quan project |

---

## 💡 Tips

### 1. Monitoring
```bash
# Xem real-time logs
docker-compose logs -f

# Xem resource usage
docker stats
```

### 2. Database Access
```bash
# Connect to MySQL
docker exec -it ev-identity-mysql mysql -uroot -proot123 ev_identity_db

# List tables
SHOW TABLES;

# View users
SELECT * FROM users;
```

### 3. Restart Specific Service
```bash
# Rebuild và restart
docker-compose build identity-service
docker-compose up -d identity-service

# Xem logs
docker logs -f ev-identity-service
```

### 4. Clean Up
```bash
# Xóa tất cả containers stopped
docker container prune

# Xóa tất cả images không dùng
docker image prune -a

# Xóa tất cả volumes không dùng
docker volume prune
```

---

## 🆘 Cần Trợ Giúp?

### Kiểm tra đầy đủ
```bash
# Chạy script kiểm tra
# Windows
.\check-status.ps1

# macOS/Linux
./check-status.sh
```

### Export logs để debug
```bash
# Export tất cả logs
docker-compose logs > logs.txt

# Gửi file logs.txt khi báo lỗi
```

### Common Commands Cheat Sheet
```bash
# Start all
docker-compose up -d

# Stop all
docker-compose down

# Rebuild specific service
docker-compose build <service-name>

# View logs
docker logs <container-name>

# Restart service
docker-compose restart <service-name>

# Check running containers
docker ps

# Check all containers
docker ps -a
```

---

## ✅ Checklist Sau Khi Cài Đặt

- [ ] Docker Desktop đang chạy
- [ ] Tất cả 11 containers đều có status "Up"
- [ ] Eureka Dashboard accessible tại http://localhost:8761
- [ ] 5 services đã registered trong Eureka
- [ ] Frontend accessible tại http://localhost
- [ ] Login thành công với credentials đã cho
- [ ] Redirect đến dashboard sau khi login
- [ ] Không có errors trong browser console

---

## 🎉 Chúc Mừng!

Nếu tất cả các bước trên đã hoàn thành, bạn đã cài đặt và chạy thành công **EV Platform**!

**Happy Coding!** 🚀

---

**Tạo**: November 18, 2025
**Phiên bản**: 1.0
**Tác giả**: EV Platform Team

