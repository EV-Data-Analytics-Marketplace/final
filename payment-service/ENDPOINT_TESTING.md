# Payment Service - Endpoint Testing Guide

## Khởi động Service

### Yêu cầu
- MySQL đang chạy với database `ev_payment_db`
- Port 8083 chưa bị sử dụng
- Eureka Server đang chạy (optional, nếu muốn service discovery)

### Cách khởi động

```powershell
# Từ thư mục payment-service
mvn clean package -DskipTests
java -jar target/payment-service-1.0.0.jar
```

Hoặc:

```powershell
mvnw.cmd spring-boot:run
```

Service sẽ chạy tại: `http://localhost:8083/payment`

## Danh sách Endpoints

### 1. Health & Info (Public - No Auth Required)

#### Check Health
```powershell
curl http://localhost:8083/payment/actuator/health
```

#### Get Service Info
```powershell
curl http://localhost:8083/payment/api/health/info
```

#### Ping Service
```powershell
curl http://localhost:8083/payment/api/health/ping
```

### 2. Transaction Endpoints (Requires JWT)

#### Create Transaction
```powershell
curl -X POST http://localhost:8083/payment/api/transactions `
  -H "Authorization: Bearer YOUR_JWT_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{
    "datasetId": 1,
    "amount": 100.00,
    "transactionType": "PURCHASE",
    "paymentMethodId": 1
  }'
```

#### Get My Transactions
```powershell
curl http://localhost:8083/payment/api/transactions/my-transactions `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Consumer Transactions (Requires DATA_CONSUMER role)
```powershell
curl http://localhost:8083/payment/api/transactions/consumer `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Provider Transactions (Requires DATA_PROVIDER role)
```powershell
curl http://localhost:8083/payment/api/transactions/provider `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Transaction by ID
```powershell
curl http://localhost:8083/payment/api/transactions/1 `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Transaction by Reference ID
```powershell
curl http://localhost:8083/payment/api/transactions/ref/TXN-12345 `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Payment Method Endpoints (Requires JWT)

#### Add Payment Method
```powershell
curl -X POST http://localhost:8083/payment/api/payment-methods `
  -H "Authorization: Bearer YOUR_JWT_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{
    "methodType": "CREDIT_CARD",
    "cardNumber": "4111111111111111",
    "cardHolderName": "John Doe",
    "expiryDate": "12/25",
    "isDefault": true
  }'
```

#### Get My Payment Methods
```powershell
curl http://localhost:8083/payment/api/payment-methods `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Set Default Payment Method
```powershell
curl -X PATCH http://localhost:8083/payment/api/payment-methods/1/set-default `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Delete Payment Method
```powershell
curl -X DELETE http://localhost:8083/payment/api/payment-methods/1 `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Refund Endpoints (Requires JWT)

#### Create Refund Request
```powershell
curl -X POST http://localhost:8083/payment/api/refunds `
  -H "Authorization: Bearer YOUR_JWT_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{
    "transactionId": 1,
    "reason": "Not satisfied with data quality",
    "amount": 100.00
  }'
```

#### Get My Refunds
```powershell
curl http://localhost:8083/payment/api/refunds/my-refunds `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Approve Refund (Requires ADMIN role)
```powershell
curl -X POST http://localhost:8083/payment/api/refunds/1/approve `
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### Reject Refund (Requires ADMIN role)
```powershell
curl -X POST "http://localhost:8083/payment/api/refunds/1/reject?reason=Invalid request" `
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 5. Provider Revenue Endpoints (Requires DATA_PROVIDER role)

#### Get My Revenue
```powershell
curl http://localhost:8083/payment/api/revenue/my-revenue `
  -H "Authorization: Bearer YOUR_PROVIDER_JWT_TOKEN"
```

#### Get Revenue by Month
```powershell
curl "http://localhost:8083/payment/api/revenue/month?year=2025&month=11" `
  -H "Authorization: Bearer YOUR_PROVIDER_JWT_TOKEN"
```

#### Get Total Earnings
```powershell
curl http://localhost:8083/payment/api/revenue/total-earnings `
  -H "Authorization: Bearer YOUR_PROVIDER_JWT_TOKEN"
```

### 6. Admin Payment Endpoints (Requires ADMIN role)

#### Get Payment Statistics
```powershell
curl http://localhost:8083/payment/api/admin/payment/stats `
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### Get All Transactions
```powershell
# All transactions
curl http://localhost:8083/payment/api/admin/payment/transactions `
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Filter by status
curl "http://localhost:8083/payment/api/admin/payment/transactions?status=COMPLETED" `
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### Get All Refunds
```powershell
# All refunds
curl http://localhost:8083/payment/api/admin/payment/refunds `
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Filter by status
curl "http://localhost:8083/payment/api/admin/payment/refunds?status=PENDING" `
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### Get Provider Revenues
```powershell
curl http://localhost:8083/payment/api/admin/payment/provider-revenues `
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### Calculate Monthly Revenue
```powershell
curl -X POST "http://localhost:8083/payment/api/admin/payment/calculate-monthly-revenue?year=2025&month=11" `
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

## Testing with PowerShell Script

Chạy script tự động để test tất cả endpoints:

```powershell
.\test-endpoints.ps1
```

## Getting JWT Token

Để lấy JWT token, cần đăng nhập qua Identity Service:

```powershell
# Login
$response = Invoke-RestMethod -Uri "http://localhost:8081/identity/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"user@example.com","password":"password123"}'

$token = $response.token
Write-Host "Token: $token"

# Sử dụng token
curl http://localhost:8083/payment/api/transactions/my-transactions `
  -H "Authorization: Bearer $token"
```

## Expected Responses

### Success Response (200/201)
```json
{
  "id": 1,
  "transactionId": "TXN-123456",
  "amount": 100.00,
  "status": "COMPLETED",
  "createdAt": "2025-11-23T10:00:00"
}
```

### Error Response (401 Unauthorized)
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

### Error Response (403 Forbidden)
```json
{
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

### Error Response (400 Bad Request)
```json
{
  "message": "Transaction failed",
  "error": "Insufficient balance"
}
```

## Troubleshooting

### Service không khởi động được
1. Kiểm tra MySQL đang chạy: `mysql -u root -p`
2. Kiểm tra database đã tồn tại: `SHOW DATABASES LIKE 'ev_payment_db';`
3. Kiểm tra port 8083 chưa bị chiếm: `netstat -ano | findstr :8083`
4. Xem log chi tiết trong console

### 401 Unauthorized
- Kiểm tra JWT token có hợp lệ không
- Kiểm tra JWT secret giống với Identity Service
- Kiểm tra token chưa hết hạn

### 403 Forbidden
- Kiểm tra role trong JWT token
- Endpoint yêu cầu role đặc biệt (ADMIN, DATA_PROVIDER, DATA_CONSUMER)

### Connection refused
- Service chưa khởi động hoặc đang khởi động
- Port hoặc context-path không đúng

