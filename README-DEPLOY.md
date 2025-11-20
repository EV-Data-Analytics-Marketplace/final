# EV Platform - Quick Start Guide

## 🚀 Deploy Hệ Thống

### Cách 1: Deploy Tự Động (KHUYẾN NGHỊ)
```cmd
quick-deploy.bat
```
Script này sẽ tự động:
- Dừng và xóa containers cũ
- Build lại tất cả services
- Start theo đúng thứ tự
- Mở Eureka Dashboard để kiểm tra

### Cách 2: Rebuild Từ Đầu
```cmd
rebuild-all.bat
```

## 🔍 Kiểm Tra Hệ Thống

### Kiểm tra trạng thái
```cmd
status.bat
```

### Kiểm tra services đã start
```cmd
test-deployment.bat
```

### Xem logs của một service
```cmd
docker logs ev-identity-service
docker logs ev-api-gateway
docker logs ev-frontend
```

## 🌐 Truy Cập Ứng Dụng

| Service | URL | Mô tả |
|---------|-----|-------|
| **Frontend** | http://localhost | Giao diện React |
| **API Gateway** | http://localhost:8080 | Cổng API chính |
| **Eureka Dashboard** | http://localhost:8761 | Quản lý services |

## 🔐 Đăng Nhập

Khi truy cập http://localhost, bạn sẽ thấy trang login.

**Lưu ý quan trọng**:
- Frontend chạy trên port 80 (Nginx)
- Nginx tự động proxy tất cả API requests đến API Gateway (port 8080)
- Bạn **KHÔNG** cần truy cập trực tiếp port 8080

### Test Login API qua Frontend
```cmd
curl -X POST http://localhost/identity/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Test Login API qua API Gateway
```cmd
curl -X POST http://localhost:8080/identity/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

## 🛠️ Troubleshooting

### Không đăng nhập được?

**Bước 1: Kiểm tra tất cả services đang chạy**
```cmd
docker ps -a | findstr "ev-"
```
Tất cả containers phải có status "Up".

**Bước 2: Kiểm tra Eureka Dashboard**
```
http://localhost:8761
```
Phải thấy tất cả services đã registered:
- API-GATEWAY
- IDENTITY-SERVICE  
- DATA-SERVICE
- PAYMENT-SERVICE
- ANALYTICS-SERVICE

**Bước 3: Kiểm tra Identity Service logs**
```cmd
docker logs ev-identity-service --tail 50
```
Tìm dòng "Started IdentityServiceApplication" - chứng tỏ đã start thành công.

**Bước 4: Test API trực tiếp**
```cmd
# Test health
curl http://localhost/identity/actuator/health

# Test login
curl -X POST http://localhost/identity/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**Bước 5: Kiểm tra database**
```cmd
# Connect vào MySQL
docker exec -it ev-identity-mysql mysql -uroot -proot123 ev_identity_db

# Trong MySQL shell:
SHOW TABLES;
SELECT * FROM users;
```

### Services không start?

**Solution 1: Restart theo thứ tự**
```cmd
docker-compose down
docker-compose up -d mysql-identity mysql-data mysql-payment mysql-analytics
timeout /t 30
docker-compose up -d eureka-server
timeout /t 20
docker-compose up -d
```

**Solution 2: Rebuild hoàn toàn**
```cmd
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**Solution 3: Sử dụng quick-deploy**
```cmd
quick-deploy.bat
```

### Frontend không kết nối được backend?

**Kiểm tra file .env**
```cmd
type ev-frontend\.env
```
Phải là:
```
VITE_API_GATEWAY_URL=http://localhost
```

Nếu sai, sửa lại và rebuild:
```cmd
docker-compose build --no-cache ev-frontend
docker-compose up -d ev-frontend
```

## 🛑 Dừng Hệ Thống

### Dừng tất cả (giữ data)
```cmd
docker-compose stop
```
hoặc
```cmd
stop-all.bat
```

### Dừng và xóa containers (giữ data)
```cmd
docker-compose down
```

### Dừng và xóa tất cả (kể cả data)
```cmd
docker-compose down -v
```

## 📝 Scripts Có Sẵn

| Script | Mục đích |
|--------|----------|
| `quick-deploy.bat` | Deploy nhanh toàn bộ hệ thống |
| `rebuild-all.bat` | Rebuild và deploy từ đầu |
| `status.bat` | Xem trạng thái services |
| `test-deployment.bat` | Test xem services đã start chưa |
| `check-services.bat` | Kiểm tra chi tiết services |
| `stop-all.bat` | Dừng tất cả |

## 📚 Tài Liệu Chi Tiết

Xem file `DEPLOYMENT-GUIDE.md` để biết thêm chi tiết về:
- Kiến trúc hệ thống
- Cấu hình chi tiết
- Troubleshooting nâng cao
- Development tips

## 💡 Tips

1. **Luôn chờ Eureka Server start trước**: Các services khác phụ thuộc vào Eureka
2. **Kiểm tra Eureka Dashboard**: http://localhost:8761 để đảm bảo tất cả services đã registered
3. **Xem logs khi có lỗi**: `docker logs <container-name>`
4. **Frontend dùng Nginx proxy**: Không cần truy cập trực tiếp port 8080
5. **Database init tự động**: Schema được tạo tự động lần đầu start

## 🆘 Cần Trợ Giúp?

1. Chạy `test-deployment.bat` để kiểm tra
2. Xem logs: `docker logs <service-name>`
3. Kiểm tra Eureka: http://localhost:8761
4. Đọc `DEPLOYMENT-GUIDE.md` để biết chi tiết

---

**Chúc bạn deploy thành công! 🎉**

