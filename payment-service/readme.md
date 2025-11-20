# EV Data Analytics Marketplace - Payment Service

## 📋 Mô tả

Payment Service xử lý tất cả các giao dịch thanh toán, quản lý phương thức thanh toán, tính toán doanh thu cho providers và xử lý refund trong EV Data Analytics Marketplace.

## 🏗️ Kiến trúc

```
payment-service/
├── src/main/java/com/nguyenquyen/dev/paymentservice/
│   ├── client/              # Service clients (Data Service)
│   ├── config/              # Security & WebClient configuration
│   ├── controller/          # REST Controllers
│   │   ├── TransactionController
│   │   ├── PaymentMethodController
│   │   ├── RefundController
│   │   ├── ProviderRevenueController
│   │   └── AdminPaymentController
│   ├── dto/                 # DTOs
│   │   ├── request/
│   │   └── response/
│   ├── entity/              # JPA Entities
│   │   ├── Transaction
│   │   ├── PaymentMethod
│   │   ├── ProviderRevenue
│   │   └── Refund
│   ├── repository/          # JPA Repositories
│   ├── security/            # JWT & Security
│   └── service/             # Business Logic
│       ├── TransactionService
│       ├── PaymentMethodService
│       ├── RefundService
│       └── ProviderRevenueService
└── src/main/resources/
    └── application.yml
```

## 🚀 Công nghệ sử dụng

- **Spring Boot 3.2.0**
- **Spring Security** + **JWT Integration**
- **MySQL** - Database
- **WebClient** - Microservice communication
- **Lombok** - Reduce boilerplate code
- **Spring Data JPA** - ORM
- **Maven** - Build tool

## 📦 Core Features

### 1. Transaction Management
✅ Create purchase transactions  
✅ Subscription payments  
✅ API access payments  
✅ Transaction history tracking  
✅ Multiple payment methods support  
✅ Payment status tracking (PENDING, COMPLETED, FAILED, REFUNDED)

### 2. Payment Methods
✅ Credit card management  
✅ PayPal integration (mock)  
✅ Bank transfer support  
✅ Multiple payment methods per user  
✅ Default payment method  
✅ Secure tokenization (mock with Stripe-like IDs)

### 3. Revenue Management
✅ Provider revenue calculation (15% platform fee, 85% provider share)  
✅ Monthly revenue reports  
✅ Revenue breakdown by dataset  
✅ Payment tracking (PENDING, PROCESSING, PAID)  
✅ Total earnings summary

### 4. Refund Processing
✅ Refund requests from consumers/providers  
✅ Admin approval workflow  
✅ Multiple refund reasons  
✅ Full/partial refund support  
✅ Automatic transaction status update

### 5. Admin Features
✅ Payment statistics dashboard  
✅ Transaction monitoring  
✅ Refund management  
✅ Provider revenue oversight  
✅ Monthly revenue calculation trigger

## 🔑 Database Schema

### Tables
1. **transactions** - Payment transactions
2. **payment_methods** - User payment methods
3. **provider_revenues** - Monthly revenue for providers
4. **refunds** - Refund requests and processing

### Key Relationships
```
Transaction (1) <---> (N) Refund
User (Identity Service) <---> (N) PaymentMethod
Provider (Identity Service) <---> (N) ProviderRevenue
```

## 🛠️ Cài đặt & Chạy

### 1. Yêu cầu
- Java 17+
- MySQL 8.0+
- Maven 3.8+
- Identity Service đã chạy (port 8081)
- Data Service đã chạy (port 8082)

### 2. Cài đặt MySQL

```bash
mysql -u root -p
CREATE DATABASE ev_payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Hoặc chạy script
mysql -u root -p < schema.sql
```

### 3. Cấu hình

Chỉnh sửa `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ev_payment_db
    username: root
    password: your_password

jwt:
  secret: k5H7D0qZ1OGfJp7dM87t6R2S3nHlw5kTGBv3dQF4qXU=

identity:
  service:
    url: http://localhost:8081/identity

data:
  service:
    url: http://localhost:8082/data

payment:
  platform:
    commission-rate: 0.15  # 15% platform fee
  provider:
    revenue-share: 0.85    # 85% to provider
```

### 4. Build & Run

```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

Application chạy tại: `http://localhost:8083/payment`

## 📡 Main API Endpoints

### Transaction APIs
- `POST /api/transactions` - Tạo transaction mới
- `GET /api/transactions/my-transactions` - Lịch sử giao dịch
- `GET /api/transactions/consumer` - Consumer transactions
- `GET /api/transactions/provider` - Provider transactions
- `GET /api/transactions/{id}` - Chi tiết transaction
- `GET /api/transactions/ref/{transactionId}` - Get by transaction ID

### Payment Method APIs
- `POST /api/payment-methods` - Thêm payment method
- `GET /api/payment-methods` - Danh sách payment methods
- `PATCH /api/payment-methods/{id}/set-default` - Set default
- `DELETE /api/payment-methods/{id}` - Xóa payment method

### Refund APIs
- `POST /api/refunds` - Tạo refund request
- `GET /api/refunds/my-refunds` - Danh sách refunds
- `POST /api/refunds/{id}/approve` - Approve refund (Admin)
- `POST /api/refunds/{id}/reject` - Reject refund (Admin)

### Provider Revenue APIs
- `GET /api/revenue/my-revenue` - Provider revenue history
- `GET /api/revenue/month?year=2025&month=1` - Monthly revenue
- `GET /api/revenue/total-earnings` - Total earnings

### Admin APIs
- `GET /api/admin/payment/stats` - Payment statistics
- `GET /api/admin/payment/transactions` - All transactions
- `GET /api/admin/payment/refunds` - All refunds
- `GET /api/admin/payment/provider-revenues` - Provider revenues
- `POST /api/admin/payment/calculate-monthly-revenue` - Calculate revenue

## 🔐 Security & Integration

### JWT Integration
Service validate JWT token từ Identity Service và extract user info.

### Microservice Communication
- **Data Service**: Get dataset info, grant access after payment
- **Identity Service**: Get user details (via JWT claims)

### Role-based Access
- **DATA_CONSUMER**: Mua datasets, manage payment methods, request refunds
- **DATA_PROVIDER**: View revenue, transaction history
- **ADMIN**: Full payment management, approve refunds, calculate revenue

## 💰 Payment Flow

### Consumer Purchase Flow
```
1. Consumer selects dataset → POST /api/transactions
2. Payment Service validates dataset from Data Service
3. Calculate fees: 15% platform, 85% provider
4. Process payment (mock integration)
5. If success:
   - Transaction status = COMPLETED
   - Notify Data Service to grant access
6. If fail:
   - Transaction status = FAILED
```

### Refund Flow
```
1. Consumer/Provider → POST /api/refunds
2. Refund status = PENDING
3. Admin reviews → POST /api/refunds/{id}/approve
4. Process refund (mock)
5. Refund status = COMPLETED
6. Transaction status = REFUNDED
```

### Revenue Calculation Flow
```
1. Admin triggers monthly calculation
2. Get all COMPLETED transactions for month
3. Group by provider
4. Calculate: totalRevenue, platformFee, netRevenue
5. Save to provider_revenues table
6. Provider can view via /api/revenue/my-revenue
```

## 📊 Transaction Types

| Type | Description | Access Granted |
|------|-------------|----------------|
| **PURCHASE** | One-time purchase | Permanent download access |
| **SUBSCRIPTION** | Monthly/yearly subscription | Time-limited access |
| **API_ACCESS** | API call package | API calls with limit |

## 💳 Payment Methods

| Method | Status | Integration |
|--------|--------|-------------|
| **CREDIT_CARD** | Mock | Stripe-like tokenization |
| **PAYPAL** | Mock | PayPal email storage |
| **BANK_TRANSFER** | Mock | Bank account info |
| **CRYPTO** | Future | - |

## 📈 Statistics & Monitoring

Service cung cấp API để tracking:
- Total transactions & revenue
- Platform fees collected
- Provider earnings breakdown
- Refund statistics
- Transaction success rate
- Revenue by month/dataset

## 🔄 Scheduled Tasks (Future)

### Monthly Revenue Calculation
```java
@Scheduled(cron = "0 0 1 1 * ?") // 1st day of month at 00:00
public void calculateMonthlyRevenue() {
    int year = LocalDateTime.now().getYear();
    int month = LocalDateTime.now().getMonthValue() - 1;
    providerRevenueService.calculateMonthlyRevenue(year, month);
}
```

### Failed Transaction Cleanup
```java
@Scheduled(cron = "0 0 2 * * ?") // Daily at 02:00
public void cleanupFailedTransactions() {
    transactionRepository.deleteOldFailedTransactions(
        LocalDateTime.now().minusDays(30)
    );
}
```

## 🧪 Testing

### Quick Test Flow

```bash
# 1. Login as consumer
curl -X POST http://localhost:8081/identity/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"consumer@startup.com","password":"consumer123"}'

# 2. Add payment method
curl -X POST http://localhost:8083/payment/api/payment-methods \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CREDIT_CARD",
    "cardNumber": "4242424242424242",
    "cardHolderName": "John Doe",
    "cardExpMonth": "12",
    "cardExpYear": "2025",
    "cardCvv": "123",
    "isDefault": true
  }'

# 3. Purchase dataset
curl -X POST http://localhost:8083/payment/api/transactions \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "datasetId": 1,
    "transactionType": "PURCHASE",
    "amount": 99.99,
    "paymentMethod": "CREDIT_CARD"
  }'

# 4. View my transactions
curl -X GET http://localhost:8083/payment/api/transactions/my-transactions \
  -H "Authorization: Bearer {token}"
```

## 🔧 Configuration

### Platform Commission
Thay đổi % platform fee trong `application.yml`:
```yaml
payment:
  platform:
    commission-rate: 0.15  # 15% platform
  provider:
    revenue-share: 0.85    # 85% provider
```

### Payment Gateway (Production)
Tích hợp Stripe/PayPal thật:
```yaml
stripe:
  api-key: sk_live_xxxxx
  webhook-secret: whsec_xxxxx
```

## 🔗 Integration với services khác

### With Identity Service
- Validate JWT tokens
- Get user info (userId, email, role)

### With Data Service
- Get dataset pricing info
- Grant access after successful payment
- Track dataset revenue

### With Analytics Service (Future)
- Payment analytics
- Revenue forecasting
- Provider performance metrics

## 🐛 Troubleshooting

### Lỗi kết nối Data Service
```
Error: Failed to fetch dataset info
Solution: Đảm bảo Data Service đang chạy ở port 8082
```

### Lỗi payment processing
```
Error: Payment failed
Solution: Check payment gateway configuration và logs
```

### Lỗi revenue calculation
```
Error: No transactions found
Solution: Đảm bảo có transactions với status COMPLETED trong tháng
```

## 📝 TODO / Future Enhancements

- [ ] Real Stripe integration
- [ ] PayPal SDK integration
- [ ] Cryptocurrency payments
- [ ] Recurring subscription billing
- [ ] Invoice generation (PDF)
- [ ] Payment reminder emails
- [ ] Dispute management
- [ ] Multi-currency support
- [ ] Tax calculation
- [ ] Payment analytics dashboard
- [ ] Webhook for payment status
- [ ] Fraud detection
- [ ] 3D Secure authentication

## 📞 Contact & Support

- Email: support@evdata.com
- Documentation: /docs

## 📄 License

Copyright © 2025 EV Data Analytics Marketplace