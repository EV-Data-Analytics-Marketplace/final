# 🚀 EV Platform - Quick Start

> **Hướng dẫn cài đặt và chạy nhanh trong 5 phút!**

## ⚡ TL;DR

```bash
# 1. Clone project
git clone YOUR_GIT_URL ev-platform
cd ev-platform

# 2. Deploy (Windows)
quick-deploy.bat

# 2. Deploy (macOS/Linux)
./quick-deploy.sh

# 3. Mở browser
http://localhost

# 4. Login
Email: admin@evdata.com
Password: password
```

---

## 📋 Yêu Cầu

- ✅ Docker Desktop (phiên bản 4.0+)
- ✅ 8GB RAM
- ✅ 10GB dung lượng trống

**Chưa cài Docker?** → [Download tại đây](https://www.docker.com/products/docker-desktop)

---

## 🎯 Cài Đặt Chi Tiết

### Bước 1: Chuẩn Bị

```bash
# Kiểm tra Docker đã cài chưa
docker --version
docker-compose --version
```

Nếu thấy lỗi → **Cài Docker Desktop** và restart máy.

### Bước 2: Clone Project

```bash
# Clone repo (hoặc giải nén ZIP)
git clone YOUR_GIT_URL ev-platform
cd ev-platform
```

### Bước 3: Kiểm Tra File Cấu Hình

**Windows**:
```cmd
type ev-frontend\.env
```

**macOS/Linux**:
```bash
cat ev-frontend/.env
```

**Phải là**:
```
VITE_API_GATEWAY_URL=http://localhost
```

### Bước 4: Deploy

#### Windows
```cmd
quick-deploy.bat
```

#### macOS/Linux
```bash
chmod +x quick-deploy.sh
./quick-deploy.sh
```

**⏱️ Thời gian**: 15-20 phút lần đầu (build images)

### Bước 5: Kiểm Tra

```bash
# Xem containers đang chạy
docker ps
```

Phải thấy **11 containers** đang UP:
- ev-eureka-server
- ev-api-gateway
- ev-identity-service
- ev-data-service
- ev-payment-service
- ev-analytics-service
- ev-frontend
- ev-identity-mysql
- ev-data-mysql
- ev-payment-mysql
- ev-analytics-mysql

### Bước 6: Truy Cập

1. **Mở browser**: http://localhost

2. **Clear cache**: `Ctrl + Shift + Delete`

3. **Hard reload**: `Ctrl + Shift + R`

4. **Login**:
   ```
   Email: admin@evdata.com
   Password: password
   ```

5. **Success!** 🎉 Bạn sẽ thấy admin dashboard

---

## 📊 Service URLs

| Service | URL | Mô Tả |
|---------|-----|-------|
| Frontend | http://localhost | React App |
| API Gateway | http://localhost:8080 | REST API |
| Eureka | http://localhost:8761 | Service Registry |

---

## 🛑 Dừng Hệ Thống

```bash
# Dừng tất cả
docker-compose down

# Dừng và xóa data
docker-compose down -v
```

---

## ❓ Gặp Vấn Đề?

### 1. Login Failed (401)?

**Kiểm tra**:
- Email: `admin@evdata.com` (chính xác)
- Password: `password` (KHÔNG phải admin123)
- Clear browser cache và hard reload

### 2. Port đã được sử dụng?

```bash
# Windows
netstat -ano | findstr :80
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :80
kill -9 <PID>
```

### 3. Eureka Server unhealthy?

```bash
docker restart ev-eureka-server
sleep 30
docker-compose up -d
```

### 4. Frontend không load?

```bash
docker-compose build --no-cache ev-frontend
docker-compose up -d ev-frontend
```

**Browser**: Clear cache + Hard reload

---

## 📚 Tài Liệu Đầy Đủ

Để biết chi tiết về troubleshooting, architecture, và advanced config:

👉 **[INSTALLATION-GUIDE.md](INSTALLATION-GUIDE.md)** - Hướng dẫn đầy đủ (100+ trang)

---

## 🎓 Học Thêm

| File | Nội Dung |
|------|----------|
| **INSTALLATION-GUIDE.md** | Hướng dẫn cài đặt chi tiết |
| **SUCCESS.md** | Chi tiết về login fix |
| **OPTION1-SOLUTION.md** | Architecture và API design |
| **README.md** | Tổng quan project |

---

## ✅ Checklist

- [ ] Docker Desktop đang chạy
- [ ] Clone project thành công
- [ ] Deploy thành công (11 containers UP)
- [ ] Eureka hiện 5 services
- [ ] Login thành công
- [ ] Vào được dashboard

---

## 🆘 Cần Giúp Đỡ?

1. **Check logs**:
   ```bash
   docker-compose logs -f
   ```

2. **Check status**:
   ```bash
   # Windows
   .\check-status.ps1
   
   # macOS/Linux  
   ./check-status.sh
   ```

3. **Export logs**:
   ```bash
   docker-compose logs > debug.log
   ```

---

## 🎉 Thành Công!

Nếu bạn thấy admin dashboard, **chúc mừng!** 🚀

Bạn đã cài đặt thành công **EV Platform**!

---

**Created**: November 18, 2025
**Version**: 1.0

**Happy Coding!** 💻

