# EV Data Analytics Marketplace - Identity Service

## 📋 Mô tả

Identity Service là service xử lý authentication và user management cho EV Data Analytics Marketplace. Service sử dụng Spring Boot, OAuth2, JWT (HS256), và MySQL.

## 🏗️ Kiến trúc

```
identity-service/
├── src/main/java/com/evdata/identity/
│   ├── config/              # Security & App configuration
│   ├── constant/            # Constants & Enums
│   ├── controller/          # REST Controllers
│   ├── dto/                 # Data Transfer Objects
│   │   ├── request/
│   │   └── response/
│   ├── entity/              # JPA Entities
│   ├── exception/           # Exception Handlers
│   ├── repository/          # JPA Repositories
│   ├── security/            # JWT & Security
│   └── service/             # Business Logic
└── src/main/resources/
    └── application.properties
```

## 🚀 Công nghệ sử dụng

- **Spring Boot 3.2.0**
- **Spring Security** + **OAuth2**
- **JWT (HS256)** - JSON Web Token
- **MySQL** - Database
- **Lombok** - Reduce boilerplate code
- **Spring Data JPA** - ORM
- **Maven** - Build tool

## 📦 Dependencies chính

```xml
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation
- mysql-connector-j
- lombok
```

## 🛠️ Cài đặt & Chạy

### 1. Yêu cầu hệ thống
- Java 17+
- MySQL 8.0+
- Maven 3.8+

### 2. Cài đặt MySQL

```bash
# Tạo database
mysql -u root -p
CREATE DATABASE ev_identity_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Hoặc chạy script SQL
mysql -u root -p < schema.sql
```

### 3. Cấu hình

Chỉnh sửa `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ev_identity_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT Secret (đổi thành secret key của bạn)
jwt.secret=your-256-bit-secret-key-here-for-hs256-algorithm-minimum-32-characters
jwt.expiration=3600000          # 1 hour
jwt.refresh.expiration=2592000000  # 30 days
```

### 4. Build & Run

```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run

# Hoặc chạy JAR file
java -jar target/identity-service-1.0.0.jar
```

Application sẽ chạy tại: `http://localhost:8081/identity`

## 🔐 Authentication Flow

```
1. User Register/Login → Nhận Access Token + Refresh Token
2. Gọi API → Header: Authorization: Bearer {access_token}
3. Access Token hết hạn → Dùng Refresh Token để lấy token mới
4. Logout → Revoke tất cả tokens
```

## 👥 User Roles

| Role | Mô tả |
|------|-------|
| **DATA_CONSUMER** | OEM, hãng xe, startup, nhà nghiên cứu |
| **DATA_PROVIDER** | Hãng xe, trạm sạc, fleet operators |
| **ADMIN** | Quản trị viên hệ thống |

## 📊 Database Schema

### Users Table
```sql
- id (PK)
- email (UNIQUE)
- password (BCrypt)
- full_name
- phone_number
- organization
- role (DATA_CONSUMER, DATA_PROVIDER, ADMIN)
- status (ACTIVE, INACTIVE, SUSPENDED)
- email_verified
- address, country, city
- avatar
- created_at, updated_at, last_login_at
```

### Refresh Tokens Table
```sql
- id (PK)
- token (UNIQUE)
- user_id (FK → users)
- expiry_date
- revoked
- created_at
```

## 🔑 JWT Token Structure

### Access Token Payload
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "DATA_CONSUMER",
  "fullName": "John Doe",
  "sub": "user@example.com",
  "iat": 1634567890,
  "exp": 1634571490
}
```

## 🧪 Testing

### Test accounts (khởi tạo sẵn)

```
Admin:    admin@evdata.com    / admin123
Provider: provider@tesla.com  / provider123
Consumer: consumer@startup.com / consumer123
```

### Postman Testing

Xem chi tiết trong file: `API_TESTING_GUIDE.md`

## 🔒 Security Features

✅ JWT Authentication với HS256  
✅ Password encryption với BCrypt  
✅ Refresh Token rotation  
✅ Token revocation khi logout  
✅ CORS configuration  
✅ Role-based access control  
✅ Input validation  
✅ Scheduled token cleanup  

## 📡 Main API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh-token` - Refresh token
- `POST /api/auth/logout` - Đăng xuất

### User Management
- `GET /api/users/profile` - Xem profile
- `PUT /api/users/profile` - Cập nhật profile
- `PUT /api/users/change-password` - Đổi mật khẩu

### Admin
- `GET /api/admin/users` - Danh sách users
- `GET /api/admin/users/stats` - Thống kê users
- `PATCH /api/admin/users/{id}/status` - Đổi status
- `POST /api/admin/users/{id}/suspend` - Suspend user
- `DELETE /api/admin/tokens/cleanup` - Cleanup tokens

## 🔧 Troubleshooting

### Lỗi kết nối MySQL
```
Error: Communications link failure
Solution: Kiểm tra MySQL đã chạy và port 3306 mở
```

### Lỗi JWT
```
Error: JWT signature does not match
Solution: Đảm bảo jwt.secret giống nhau khi generate và validate
```

### Lỗi 401 Unauthorized
```
Solution: 
- Kiểm tra token đã hết hạn chưa
- Header format: "Authorization: Bearer {token}"
```

## 📝 TODO / Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] OAuth2 social login (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] User activity logging
- [ ] Rate limiting
- [ ] API documentation với Swagger
- [ ] Unit & Integration tests
- [ ] Docker containerization

## 🤝 Integration với services khác

Identity Service sẽ được tích hợp với:
- **Data Service** - Xác thực truy cập catalog/dataset
- **Payment Service** - Xác thực user khi thanh toán
- **Analytics Service** - Phân quyền xem dashboard/reports

## 📞 Contact & Support

- Email: support@evdata.com
- Documentation: /docs
- Issue tracking: GitHub Issues

## 📄 License

Copyright © 2025 EV Data Analytics Marketplace