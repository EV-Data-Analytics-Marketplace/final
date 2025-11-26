# Analytics Service - EV Data Platform

Service phân tích dữ liệu và AI cho nền tảng EV Data Analytics Marketplace.

## 🎯 Chức Năng Chính

### 1. Analysis Reports (Báo Cáo Phân Tích)
- **Battery Health Analysis**: Phân tích sức khỏe pin (SOH, SOC, degradation rate)
- **Charging Pattern Analysis**: Phân tích mẫu sạc điện
- **Range Analysis**: Phân tích phạm vi hoạt động
- **Energy Consumption**: Phân tích tiêu thụ năng lượng

### 2. Dashboards (Bảng Điều Khiển)
- Dashboard tùy chỉnh với widgets
- Dashboard công khai và riêng tư
- Hỗ trợ nhiều loại dashboard: Overview, Battery, Charging, Performance

### 3. AI Predictions (Dự Đoán AI)
- **Battery Degradation**: Dự đoán tuổi thọ pin
- **Charging Demand**: Dự báo nhu cầu sạc
- **Range Prediction**: Ước tính phạm vi
- **Maintenance Prediction**: Lập lịch bảo trì

### 4. Insights (Thông Tin Chi Tiết)
- Phát hiện bất thường
- Đề xuất tối ưu hóa
- Cảnh báo và khuyến nghị

### 5. Data Quality (Chất Lượng Dữ Liệu)
- Đánh giá độ đầy đủ
- Đánh giá độ chính xác
- Đánh giá tính nhất quán
- Đánh giá tính kịp thời

## 🚀 Khởi Động Service

### Yêu Cầu
- Java 17+
- Maven 3.9+
- MySQL 8.0+
- Docker & Docker Compose (optional)

### Chạy Với Docker Compose

```bash
# Build và khởi động
docker-compose up -d

# Xem logs
docker-compose logs -f analytics-service

# Dừng service
docker-compose down
```

### Chạy Local

```bash
# Build project
mvn clean package -DskipTests

# Chạy application
java -jar target/analytics-service-1.0.0.jar
```

Service sẽ chạy tại: `http://localhost:8084/analytics`

## 📡 API Endpoints

### Analysis Reports

#### Tạo báo cáo phân tích
```http
POST /analytics/api/reports
Authorization: Bearer {token}
Content-Type: application/json

{
  "reportType": "BATTERY_HEALTH",
  "datasetId": 1,
  "title": "Battery Health Report Q4 2024",
  "description": "Quarterly battery health analysis",
  "parameters": {
    "startDate": "2024-10-01",
    "endDate": "2024-12-31",
    "vehicleTypes": ["Model 3", "Model Y"]
  }
}
```

#### Lấy danh sách báo cáo của tôi
```http
GET /analytics/api/reports/my-reports
Authorization: Bearer {token}
```

#### Lấy chi tiết báo cáo
```http
GET /analytics/api/reports/{id}
Authorization: Bearer {token}
```

#### Xóa báo cáo
```http
DELETE /analytics/api/reports/{id}
Authorization: Bearer {token}
```

### Dashboards

#### Tạo dashboard
```http
POST /analytics/api/dashboards
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Battery Performance Dashboard",
  "description": "Real-time battery metrics",
  "dashboardType": "BATTERY",
  "config": {
    "refreshInterval": 30,
    "layout": "grid"
  },
  "widgets": [
    {
      "type": "chart",
      "title": "SOH Trend",
      "chartType": "line",
      "dataSource": "battery_health"
    },
    {
      "type": "metric",
      "title": "Average SOC",
      "metric": "average_soc"
    }
  ],
  "isPublic": false
}
```

#### Lấy dashboards của tôi
```http
GET /analytics/api/dashboards/my-dashboards
Authorization: Bearer {token}
```

#### Lấy public dashboards
```http
GET /analytics/api/dashboards/public
```

#### Cập nhật dashboard
```http
PUT /analytics/api/dashboards/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Dashboard Name",
  ...
}
```

### AI Predictions

#### Tạo dự đoán
```http
POST /analytics/api/predictions
Authorization: Bearer {token}
Content-Type: application/json

{
  "predictionType": "BATTERY_DEGRADATION",
  "datasetId": 1,
  "inputData": {
    "currentSOH": 92.5,
    "vehicleAge": 2.5,
    "cycleCount": 450,
    "averageTemperature": 25.0,
    "fastChargingPercentage": 35.0
  },
  "modelVersion": "v1.0"
}
```

#### Lấy predictions của tôi
```http
GET /analytics/api/predictions/my-predictions
Authorization: Bearer {token}
```

#### Lấy chi tiết prediction
```http
GET /analytics/api/predictions/{id}
Authorization: Bearer {token}
```

### Insights

#### Lấy insights đang hoạt động
```http
GET /analytics/api/insights/active
```

#### Lấy insights theo dataset
```http
GET /analytics/api/insights/dataset/{datasetId}
```

#### Vô hiệu hóa insight
```http
POST /analytics/api/insights/{id}/deactivate
Authorization: Bearer {token}
```

### Data Quality

#### Đánh giá chất lượng dữ liệu
```http
POST /analytics/api/quality/assess/{datasetId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "recordCount": 10000,
  "completeness": 95.5,
  "nullValues": 450,
  "duplicates": 23,
  "outliers": 78
}
```

#### Lấy đánh giá chất lượng mới nhất
```http
GET /analytics/api/quality/dataset/{datasetId}/latest
```

#### Lấy datasets chất lượng thấp (Admin only)
```http
GET /analytics/api/quality/low-quality?threshold=70.0
Authorization: Bearer {admin_token}
```

### Admin Endpoints

#### Thống kê analytics (Admin only)
```http
GET /analytics/api/admin/analytics/stats
Authorization: Bearer {admin_token}
```

Response:
```json
{
  "totalReports": 250,
  "totalDashboards": 45,
  "totalPredictions": 180,
  "totalInsights": 320,
  "averageDataQuality": 87.5,
  "reportsByType": {
    "BATTERY_HEALTH": 85,
    "CHARGING_PATTERN": 65,
    "RANGE_ANALYSIS": 55,
    "ENERGY_CONSUMPTION": 45
  },
  "predictionsByType": {
    "BATTERY_DEGRADATION": 70,
    "CHARGING_DEMAND": 45,
    "RANGE_PREDICTION": 40,
    "MAINTENANCE_PREDICTION": 25
  },
  "recentInsights": [...],
  "timestamp": "2024-11-01T10:30:00"
}
```

## 🔐 Authentication

Tất cả các endpoints (trừ một số public endpoints) yêu cầu JWT token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Report Types

| Type | Description |
|------|-------------|
| BATTERY_HEALTH | Phân tích sức khỏe pin (SOH, SOC, degradation) |
| CHARGING_PATTERN | Phân tích hành vi sạc điện |
| RANGE_ANALYSIS | Phân tích hiệu suất phạm vi hoạt động |
| ENERGY_CONSUMPTION | Phân tích tiêu thụ năng lượng |

## 🤖 Prediction Types

| Type | Description |
|------|-------------|
| BATTERY_DEGRADATION | Dự đoán tuổi thọ và suy giảm pin |
| CHARGING_DEMAND | Dự báo nhu cầu hạ tầng sạc |
| RANGE_PREDICTION | Ước tính phạm vi hoạt động |
| MAINTENANCE_PREDICTION | Dự đoán lịch bảo trì |

## 📈 Dashboard Types

| Type | Description |
|------|-------------|
| OVERVIEW | Tổng quan tất cả metrics |
| BATTERY | Tập trung vào metrics pin |
| CHARGING | Tập trung vào dữ liệu sạc |
| PERFORMANCE | Metrics hiệu suất tổng thể |

## 🔍 Insight Categories

| Category | Description |
|----------|-------------|
| BATTERY | Insights liên quan đến pin |
| CHARGING | Insights về sạc điện |
| PERFORMANCE | Insights về hiệu suất |
| USAGE | Insights về mô hình sử dụng |
| GENERAL | Insights tổng quát |

## 📝 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🏗️ Database Schema

Service sử dụng 6 bảng chính:
- `analysis_reports`: Lưu trữ báo cáo phân tích
- `dashboards`: Lưu trữ dashboards
- `ai_predictions`: Lưu trữ dự đoán AI
- `analytics_metrics`: Lưu trữ metrics
- `insights`: Lưu trữ insights
- `data_quality_scores`: Lưu trữ điểm chất lượng

## 🔗 Tích Hợp Với Services Khác

### Identity Service (Port 8081)
- Authentication & Authorization
- User information

### Data Service (Port 8082)
- Dataset information
- Data access verification

### Payment Service (Port 8083)
- Transaction history for analytics

## 🛠️ Configuration

Cấu hình chính trong `application.yml`:

```yaml
server:
  port: 8084

analytics:
  ai:
    enabled: true
    models:
      battery-health: v1.0
      charging-demand: v1.0
  cache:
    ttl: 3600
```

## 📦 Dependencies

- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- MySQL Connector
- Jackson
- Lombok
- WebFlux (cho service communication)

## 🧪 Testing

```bash
# Run tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## 📄 License

MIT License

## 👥 Contact

For issues and questions, please contact the development team.