# 🎯 EV Platform - QUICK START

## 📦 Dành Cho Người Mới - Hướng Dẫn Cài Đặt

**Bạn là người mới nhận project này?** Đọc hướng dẫn sau:

### 🚀 Quick Start (5 phút)
👉 **[QUICK-START.md](QUICK-START.md)** - Bắt đầu nhanh

### 📖 Hướng Dẫn Chi Tiết (Khuyến nghị)
👉 **[INSTALLATION-GUIDE.md](INSTALLATION-GUIDE.md)** - Hướng dẫn đầy đủ từ A-Z

### 📄 Plain Text Guide
👉 **[README.txt](README.txt)** - Hướng dẫn text đơn giản

---

## ⚡ Bạn Gặp Vấn Đề Login? → Đã Fix Rồi!

**Đọc ngay**: [`START-HERE.md`](START-HERE.md)

Vấn đề 401 Unauthorized đã được khắc phục. Frontend đã được rebuild với API paths đúng.

## 🚀 Deploy Ngay (3 Bước)

### Bước 1: Verify Login Fix
```cmd
verify-login-fix.bat
```

### Bước 2: Nếu cần deploy lại toàn bộ
```cmd
quick-deploy.bat
```

### Bước 3: Mở browser
```
http://localhost
```
Login với:
- Email: `admin@evdata.com`
- Password: `password`

## 📖 Tài Liệu Đầy Đủ

| File | Mô Tả | Khi Nào Đọc |
|------|-------|-------------|
| **[START-HERE.md](START-HERE.md)** | 🔥 Bắt đầu từ đây! | Ngay bây giờ |
| **[LOGIN-FIX-SUMMARY.md](LOGIN-FIX-SUMMARY.md)** | Chi tiết về login fix | Khi muốn hiểu fix |
| **[DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)** | Hướng dẫn deploy chi tiết | Khi cần troubleshoot |
| **[README-DEPLOY.md](README-DEPLOY.md)** | Quick deployment guide | Khi deploy lại |

## 🎮 Menu Quản Lý

Chạy menu tổng hợp (recommended):
```cmd
menu.bat
```

Menu có các options:
1. Quick Deploy
2. Rebuild All
3. Check Status
4. Test Deployment
5. Test Login
6. View Eureka
7. View Frontend
8. View Logs
9. Stop All

## 🛠️ Scripts Quan Trọng

### ⭐ Recommended
```cmd
verify-login-fix.bat    # Verify login đã fix
menu.bat                # Menu tổng hợp
check-status.ps1        # Check chi tiết status
```

### Deploy & Build
```cmd
quick-deploy.bat        # Deploy nhanh
rebuild-all.bat         # Rebuild từ đầu
```

### Testing
```cmd
test-login.bat          # Test login API
test-deployment.bat     # Test tất cả services
```

### Management
```cmd
status.bat              # Xem status
stop-all.bat            # Dừng tất cả
```

## 🌐 Access URLs

| Service | URL | Mô Tả |
|---------|-----|-------|
| **Frontend** | http://localhost | React app (Nginx) |
| **API Gateway** | http://localhost:8080 | REST API Gateway |
| **Eureka** | http://localhost:8761 | Service Discovery |
| **Identity Service** | http://localhost:8081 | Authentication |
| **Data Service** | http://localhost:8082 | Dataset Management |
| **Payment Service** | http://localhost:8083 | Transactions |
| **Analytics Service** | http://localhost:8084 | Analytics |

## 👥 Test Users

### Admin
- Email: `admin@evdata.com`
- Password: `password` ← **Updated for testing**
- Access: Toàn bộ hệ thống

### Data Provider
- Email: `provider@evstation.com`
- Password: `provider123`
- Access: Upload datasets, manage listings

### Data Consumer
- Email: `consumer@startup.com`
- Password: `consumer123`
- Access: Browse, purchase datasets

## 🔧 Troubleshooting

### Login không được?
1. Chạy `verify-login-fix.bat`
2. Check browser console (F12)
3. Xem `LOGIN-FIX-SUMMARY.md`

### Services không start?
1. Check Docker đang chạy
2. Chạy `check-status.ps1`
3. Xem logs: `docker logs ev-identity-service`
4. Deploy lại: `quick-deploy.bat`

### Frontend không load?
1. Check container: `docker logs ev-frontend`
2. Rebuild: `docker-compose build --no-cache ev-frontend`
3. Restart: `docker-compose up -d ev-frontend`

## 📊 Architecture

```
Browser (http://localhost)
    ↓
Nginx (Frontend Container:80)
    ↓ proxy
API Gateway (8080)
    ↓ routes via Eureka
┌────────────────┬─────────────┬─────────────┬──────────────┐
│  Identity      │    Data     │   Payment   │  Analytics   │
│  Service:8081  │ Service:8082│Service:8083 │Service:8084  │
└────────────────┴─────────────┴─────────────┴──────────────┘
         ↓              ↓              ↓              ↓
    MySQL:3307    MySQL:3308    MySQL:3309    MySQL:3310
```

## 🎯 Key Features

- ✅ Microservices Architecture
- ✅ Service Discovery (Eureka)
- ✅ API Gateway (Spring Cloud Gateway)
- ✅ JWT Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ React Frontend with Nginx
- ✅ MySQL Databases
- ✅ Docker Containerization
- ✅ RESTful APIs

## 💡 Important Notes

### 1. Nginx Proxy
Frontend sử dụng Nginx để proxy API requests:
- Browser request: `http://localhost/identity/auth/login`
- Nginx proxy to: `http://api-gateway:8080/identity/auth/login`
- **KHÔNG** cần truy cập trực tiếp port 8080 từ browser

### 2. Service Discovery
Tất cả services register với Eureka:
- Check http://localhost:8761
- Tất cả phải có status "UP"

### 3. API Paths (FIXED!)
- ✅ Correct: `/identity/auth/login`
- ❌ Wrong: `/identity/api/auth/login`

### 4. Environment
File `.env` của frontend:
```
VITE_API_GATEWAY_URL=http://localhost
```

## 📦 What's Included

```
EV/
├── START-HERE.md              ← 🔥 READ THIS FIRST
├── LOGIN-FIX-SUMMARY.md       ← Login fix details
├── DEPLOYMENT-GUIDE.md        ← Full deployment guide
├── README-DEPLOY.md           ← Quick deploy guide
├── menu.bat                   ← ⭐ Main menu
├── verify-login-fix.bat       ← ⭐ Verify login
├── quick-deploy.bat           ← Quick deploy
├── rebuild-all.bat            ← Rebuild all
├── check-status.ps1           ← ⭐ Status check
├── test-login.bat             ← Test login API
├── test-deployment.bat        ← Test deployment
├── status.bat                 ← Quick status
├── stop-all.bat               ← Stop all
├── docker-compose.yml         ← Docker config
├── eureka-server/             ← Service Discovery
├── api-gateway/               ← API Gateway
├── identity-service/          ← Authentication
├── data-service/              ← Dataset Management
├── payment-service/           ← Transactions
├── analytics-service/         ← Analytics
└── ev-frontend/               ← React Frontend
```

## 🚦 Status Check

Run this to check everything:
```cmd
check-status.ps1
```

Or quick check:
```cmd
docker ps -a | findstr "ev-"
```

## 🎓 Learning Resources

1. **Understand the fix**: `LOGIN-FIX-SUMMARY.md`
2. **Deploy from scratch**: `DEPLOYMENT-GUIDE.md`
3. **Quick operations**: `README-DEPLOY.md`
4. **Verify everything works**: `verify-login-fix.bat`

## ✨ Recent Fixes

- ✅ Fixed API base URLs in all frontend services
- ✅ Removed incorrect `/api` prefix from paths
- ✅ Rebuilt frontend with correct configuration
- ✅ Created comprehensive testing and deployment scripts
- ✅ Added detailed documentation

## 🎉 Ready to Start?

### Option 1: Verify Fix (Fastest)
```cmd
verify-login-fix.bat
```

### Option 2: Full Deploy
```cmd
quick-deploy.bat
```

### Option 3: Use Menu
```cmd
menu.bat
```

---

## ⚡ TL;DR (Too Long; Didn't Read)

```cmd
# 1. Verify fix
verify-login-fix.bat

# 2. Open browser
start http://localhost

# 3. Hard reload (important!)
Press Ctrl+Shift+R

# 4. Login
Email: admin@evdata.com
Password: password
```

**Should see HTTP 200, not 401!** ✅

---

**Need Help?** 
- Check `START-HERE.md`
- Run `menu.bat` for interactive options
- View logs: `docker logs [service-name]`
- Check Eureka: http://localhost:8761

**Happy Coding! 🚀**

