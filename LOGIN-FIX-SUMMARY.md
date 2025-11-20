# Fix Login Issue - Summary

## Vấn Đề
Khi đăng nhập trên frontend, gặp lỗi **401 Unauthorized** với request:
```
POST http://localhost:8080/identity/api/auth/login 401 (Unauthorized)
```

## Nguyên Nhân
Frontend đang g��i API với path **sai**: `/identity/api/auth/login`
- Đúng phải là: `/identity/auth/login`
- Lý do: API Gateway đã route `/identity/*` đến Identity Service, không cần thêm `/api`

## Giải Pháp Đã Thực Hiện

### 1. Sửa API Base URLs trong Frontend

#### File: `ev-frontend/src/api/identityService.js`
```javascript
// BEFORE
const IDENTITY_BASE = '/identity/api';

// AFTER
const IDENTITY_BASE = '/identity';
```

#### File: `ev-frontend/src/api/dataService.js`
```javascript
// BEFORE
const DATA_BASE = '/data/api';

// AFTER
const DATA_BASE = '/data';
```

#### File: `ev-frontend/src/api/paymentService.js`
```javascript
// BEFORE
const PAYMENT_BASE = '/payment/api';

// AFTER
const PAYMENT_BASE = '/payment';
```

#### File: `ev-frontend/src/api/analyticsService.js`
```javascript
// BEFORE
const BASE_URL = '/analytics/api';

// AFTER
const BASE_URL = '/analytics';
```

### 2. Rebuild Frontend Container
```bash
docker-compose build --no-cache ev-frontend
docker-compose up -d ev-frontend
```

## Cách Hoạt Động Sau Khi Fix

### Request Flow
```
Browser → http://localhost/identity/auth/login
         ↓
    Nginx (Frontend Container)
         ↓
    API Gateway (http://api-gateway:8080/identity/auth/login)
         ↓
    Identity Service (http://identity-service:8081/auth/login)
```

### Đúng API Paths
| Endpoint | Frontend Path | Gateway Path | Service Path |
|----------|--------------|--------------|--------------|
| Login | `/identity/auth/login` | `/identity/auth/login` | `/auth/login` |
| Register | `/identity/auth/register` | `/identity/auth/register` | `/auth/register` |
| Get Profile | `/identity/users/profile` | `/identity/users/profile` | `/users/profile` |
| Search Datasets | `/data/datasets/search` | `/data/datasets/search` | `/datasets/search` |
| Create Transaction | `/payment/transactions` | `/payment/transactions` | `/transactions` |

## Kiểm Tra Sau Khi Fix

### 1. Test Login API qua curl
```bash
curl -X POST http://localhost/identity/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@evdata.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tokenType": "Bearer",
  "expiresIn": 3600000
}
```

### 2. Test qua Browser
1. Mở http://localhost
2. Login với credentials:
   - Email: `admin@evdata.com`
   - Password: `admin123`
3. Nếu thành công → redirect đến dashboard

### 3. Check Browser Console
- Không còn lỗi 401
- Request thành công với status 200
- Token được lưu vào localStorage

## Scripts Hỗ Trợ Đã Tạo

### Deploy & Management
- `menu.bat` - Menu quản lý tổng hợp
- `quick-deploy.bat` - Deploy nhanh
- `rebuild-all.bat` - Rebuild toàn bộ
- `check-status.ps1` - Kiểm tra trạng thái chi tiết

### Testing
- `test-login.bat` - Test login API
- `test-deployment.bat` - Test deployment
- `status.bat` - Xem status nhanh

## Lưu Ý Quan Trọng

### 1. Environment Configuration
File `.env` của frontend:
```
VITE_API_GATEWAY_URL=http://localhost
```
**KHÔNG PHẢI** `http://localhost:8080` vì Nginx đã proxy!

### 2. Nginx Configuration
File `nginx.conf` đã được cấu hình để proxy:
```nginx
location /identity/ {
    proxy_pass http://api-gateway:8080/identity/;
    # ... other configs
}
```

### 3. API Gateway Routes
API Gateway tự động route dựa trên prefix:
- `/identity/**` → Identity Service (port 8081)
- `/data/**` → Data Service (port 8082)
- `/payment/**` → Payment Service (port 8083)
- `/analytics/**` → Analytics Service (port 8084)

### 4. Service Discovery
Tất cả services register với Eureka Server:
- Check tại http://localhost:8761
- Đảm bảo tất cả services đều "UP"

## Troubleshooting

### Vẫn còn lỗi 401?
1. Kiểm tra Identity Service logs:
   ```bash
   docker logs ev-identity-service
   ```

2. Kiểm tra database có user chưa:
   ```bash
   docker exec -it ev-identity-mysql mysql -uroot -proot123 ev_identity_db -e "SELECT * FROM users;"
   ```

3. Kiểm tra JWT secret match giữa services:
   - Tất cả services phải dùng cùng JWT_SECRET
   - Check trong docker-compose.yml

### Frontend không load?
1. Check container:
   ```bash
   docker logs ev-frontend
   ```

2. Test nginx:
   ```bash
   curl http://localhost
   ```

3. Rebuild nếu cần:
   ```bash
   docker-compose build --no-cache ev-frontend
   docker-compose up -d ev-frontend
   ```

## Next Steps

1. **Test đầy đủ các chức năng**:
   - Login/Logout
   - Register
   - Profile management
   - Dataset operations
   - Transactions

2. **Kiểm tra tất cả roles**:
   - Admin
   - Data Provider
   - Data Consumer

3. **Monitor logs**:
   ```bash
   docker-compose logs -f
   ```

## Kết Luận

✅ **Đã fix**: API paths sai trong frontend services
✅ **Đã test**: Frontend build thành công
✅ **Next**: Test login trên browser

**Mở http://localhost và thử đăng nhập ngay!** 🚀

