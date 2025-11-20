# EV Data Analytics Marketplace - Data Service

## 📋 Mô tả

Data Service quản lý catalog dữ liệu, datasets, và quyền truy cập cho EV Data Analytics Marketplace. Service này cho phép:

- **Data Providers** đăng ký và quản lý datasets
- **Data Consumers** tìm kiếm, mua và truy cập datasets
- **Admins** quản lý và thống kê toàn bộ dữ liệu

## 🏗️ Kiến trúc

```
data-service/
├── src/main/java/com/evdata/data/
│   ├── config/              # Security configuration
│   ├── constant/            # Constants
│   ├── controller/          # REST Controllers
│   │   ├── DataCategoryController
│   │   ├── DatasetController
│   │   ├── DatasetAccessController
│   │   ├── DatasetRatingController
│   │   └── AdminDataController
│   ├── dto/                 # DTOs
│   │   ├── request/
│   │   └── response/
│   ├── entity/              # JPA Entities
│   │   ├── DataCategory
│   │   ├── Dataset
│   │   ├── DatasetAccess
│   │   └── DatasetRating
│   ├── exception/           # Exception Handlers
│   ├── repository/          # JPA Repositories
│   ├── security/            # JWT & Security
│   └── service/             # Business Logic
│       ├── DataCategoryService
│       ├── DatasetService
│       ├── DatasetAccessService
│       └── DatasetRatingService
└── src/main/resources/
    └── application.properties
```

## 🚀 Công nghệ sử dụng

- **Spring Boot 3.2.0**
- **Spring Security** + **JWT Integration**
- **MySQL** - Database
- **Lombok** - Reduce boilerplate code
- **Spring Data JPA** - ORM
- **Maven** - Build tool

## 📦 Core Features

### 1. Data Catalog Management
✅ 6 Categories mặc định (Driving Behavior, Battery Performance, Charging Station, V2G, Trip Data, Diagnostics)  
✅ CRUD operations cho categories  
✅ Active/Inactive categories

### 2. Dataset Management
✅ Create/Update/Delete datasets  
✅ Dataset status: DRAFT, PUBLISHED, ARCHIVED, SUSPENDED  
✅ Multiple data types: RAW, ANALYZED, AGGREGATED, REAL_TIME  
✅ Multiple formats: CSV, JSON, PARQUET, API, DASHBOARD  
✅ Rich metadata: tags, schema, sample data

### 3. Pricing & Access Control
✅ 4 Pricing models: FREE, PAY_PER_DOWNLOAD, SUBSCRIPTION, API_BASED  
✅ Usage rights: RESEARCH_ONLY, COMMERCIAL, OPEN  
✅ Access tracking: downloads, API calls  
✅ Expiration management

### 4. Search & Discovery
✅ Advanced search với filters  
✅ Full-text search (name, description, tags)  
✅ Sorting: price, rating, date, downloads  
✅ Pagination support

### 5. Rating & Reviews
✅ 5-star rating system  
✅ Comment/review support  
✅ Average rating calculation  
✅ User must have access to rate

### 6. Privacy & Compliance
✅ Anonymization flag  
✅ GDPR compliance flag  
✅ Geographic filtering (region, country, city)

## 🔑 Database Schema

### Tables
1. **data_categories** - Phân loại dữ liệu
2. **datasets** - Dataset metadata
3. **dataset_accesses** - Quyền truy cập và tracking
4. **dataset_ratings** - Đánh giá và reviews

### Key Relationships
```
DataCategory (1) -----> (N) Dataset
Dataset (1) -----> (N) DatasetAccess
Dataset (1) -----> (N) DatasetRating
```

## 🛠️ Cài đặt & Chạy

### 1. Yêu cầu
- Java 17+
- MySQL 8.0+
- Maven 3.8+
- Identity Service đã chạy (port 8081)

### 2. Cài đặt MySQL

```bash
mysql -u root -p
CREATE DATABASE ev_data_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Hoặc chạy script
mysql -u root -p < schema.sql
```

### 3. Cấu hình

Chỉnh sửa `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ev_data_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT Secret (PHẢI GIỐNG Identity Service)
jwt.secret=your-256-bit-secret-key-here-for-hs256-algorithm-minimum-32-characters

# Identity Service URL
identity.service.url=http://localhost:8081/identity
```

### 4. Build & Run

```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

Application chạy tại: `http://localhost:8082/data`

## 📡 Main API Endpoints

### Public APIs (No Auth)
- `GET /api/categories` - Danh sách categories
- `POST /api/datasets/search` - Tìm kiếm datasets
- `GET /api/datasets/{id}/view` - Xem dataset public

### Data Consumer APIs
- `POST /api/access/grant` - Mua/thuê dataset
- `GET /api/access/my-accesses` - Danh sách quyền truy cập
- `POST /api/ratings` - Đánh giá dataset
- `POST /api/access/download/{id}` - Download dataset

### Data Provider APIs
- `POST /api/datasets` - Tạo dataset mới
- `PUT /api/datasets/{id}` - Cập nhật dataset
- `POST /api/datasets/{id}/publish` - Publish dataset
- `GET /api/datasets/my-datasets` - Danh sách datasets của tôi

### Admin APIs
- `GET /api/admin/stats` - Thống kê tổng quan
- `GET /api/admin/datasets` - Quản lý datasets
- `PATCH /api/admin/datasets/{id}/status` - Đổi status
- `GET /api/admin/providers` - Thống kê providers

## 🔐 Security & Integration

### JWT Integration
Service này **validate JWT token** từ Identity Service:
- Extract userId, email, role từ token
- Check permissions dựa trên role
- Không cần call lại Identity Service mỗi request

### Role-based Access
- **DATA_CONSUMER**: Mua/truy cập datasets, đánh giá
- **DATA_PROVIDER**: Tạo và quản lý datasets
- **ADMIN**: Quản lý toàn bộ hệ thống

## 📊 Dataset Categories

| Code | Name | Description |
|------|------|-------------|
| DRIVING_BEHAVIOR | Driving Behavior | Hành vi lái xe, tốc độ, gia tốc |
| BATTERY_PERFORMANCE | Battery Performance | SoC, SoH, nhiệt độ pin |
| CHARGING_STATION | Charging Station Usage | Dữ liệu trạm sạc |
| V2G_TRANSACTION | V2G Transactions | Giao dịch Vehicle-to-Grid |
| TRIP_DATA | Trip Data | Hành trình, quãng đường |
| VEHICLE_DIAGNOSTICS | Vehicle Diagnostics | Chẩn đoán, mã lỗi |

## 🔄 Workflow Examples

### Provider Upload Dataset
```
1. Login → Get JWT token
2. POST /api/datasets (status: DRAFT)
3. PUT /api/datasets/{id} (update metadata)
4. POST /api/datasets/{id}/publish
5. Dataset hiển thị trên marketplace
```

### Consumer Purchase & Download
```
1. Login → Get JWT token
2. POST /api/datasets/search (tìm dataset)
3. GET /api/datasets/{id} (xem chi tiết)
4. POST /api/access/grant (mua quyền truy cập)
5. POST /api/access/download/{id} (download)
6. POST /api/ratings (đánh giá)
```

## 🧪 Testing

### Quick Test Flow

```bash
# 1. Get JWT token from Identity Service
curl -X POST http://localhost:8081/identity/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@tesla.com","password":"provider123"}'

# 2. Create dataset
curl -X POST http://localhost:8082/data/api/datasets \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Dataset",
    "code": "TEST_001",
    "categoryId": 1,
    "dataType": "RAW",
    "format": "CSV",
    "pricingModel": "FREE",
    "price": 0,
    "usageRights": "OPEN"
  }'

# 3. Search datasets
curl -X POST http://localhost:8082/data/api/datasets/search \
  -H "Content-Type: application/json" \
  -d '{"keyword":"test","page":0,"size":10}'
```

## 📈 Statistics & Monitoring

Service cung cấp API để tracking:
- Total datasets, downloads, purchases
- Average ratings
- Provider statistics
- Consumer activity
- Revenue (tích hợp với Payment Service)

## 🔧 Advanced Features

### 1. API Access Token
Khi grant access với `accessType: "API"`, system tạo `apiAccessToken`:
```
evdt_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
Token này dùng để call dataset API endpoint.

### 2. Access Expiration
- Subscription access có `expiresAt` date
- System check expiration khi access
- Can revoke access manually

### 3. API Call Limiting
- Set `apiCallsLimit` khi grant access
- Track `apiCallsUsed` mỗi request
- Block khi exceed limit

### 4. Download Tracking
- Count downloads per user
- Total downloads per dataset
- Last accessed timestamp

## 🔗 Integration Points

### With Identity Service
- Validate JWT tokens
- Get user info (userId, email, role)

### With Payment Service (Future)
- Process payments khi grant access
- Track revenue per dataset
- Provider revenue share

### With Analytics Service (Future)
- Dataset usage analytics
- Consumer behavior analysis
- Market trends

## 🐛 Troubleshooting

### Lỗi JWT validation
```
Error: Cannot validate token
Solution: Đảm bảo jwt.secret GIỐNG với Identity Service
```

### Lỗi Access Denied
```
Error: Access denied
Solution: Check user role và dataset ownership
```

### Lỗi search không trả kết quả
```
Solution: Chỉ search datasets có status = "PUBLISHED"
```

## 📝 TODO / Future Enhancements

- [ ] File upload to cloud storage (S3, Azure Blob)
- [ ] Dataset versioning
- [ ] Bulk dataset import
- [ ] Data quality scoring
- [ ] Recommendation system
- [ ] Dataset preview without purchase
- [ ] API rate limiting
- [ ] Elasticsearch integration for better search
- [ ] Dataset collaboration features
- [ ] Export to multiple formats

## 🤝 API Integration Example

### React Frontend Example
```javascript
// Search datasets
const searchDatasets = async (keyword) => {
  const response = await fetch('http://localhost:8082/data/api/datasets/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      keyword,
      page: 0,
      size: 20
    })
  });
  return response.json();
};

// Purchase dataset
const purchaseDataset = async (datasetId, token) => {
  const response = await fetch('http://localhost:8082/data/api/access/grant', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      datasetId,
      accessType: 'DOWNLOAD'
    })
  });
  return response.json();
};
```

## 📞 Contact & Support

- Email: support@evdata.com
- Documentation: /docs
- API Guide: API_TESTING_GUIDE.md

## 📄 License

Copyright © 2025 EV Data Analytics Marketplace