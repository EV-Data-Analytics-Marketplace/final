# EV Data Platform - Role-Based UI Structure

## 📁 Complete Folder Structure

```
src/
├── api/                          # API Service Layer
│   ├── httpClient.js            # Axios instance with auth interceptors
│   ├── identityService.js       # Auth & User APIs
│   ├── dataService.js           # Dataset APIs
│   ├── paymentService.js        # Payment & Transaction APIs
│   └── analyticsService.js      # Analytics & Reports APIs
│
├── contexts/                     # React Contexts
│   └── AuthContext.jsx          # Authentication & User State Management
│
├── hooks/                        # Custom React Hooks
│   ├── identity/                # Identity service hooks
│   │   ├── useLogin.js
│   │   ├── useRegister.js
│   │   ├── useLogout.js
│   │   ├── useAuth.js
│   │   ├── useProfile.js
│   │   ├── useUpdateProfile.js
│   │   ├── useChangePassword.js
│   │   ├── useUsers.js
│   │   └── useUserManagement.js
│   │
│   ├── data/                    # Data service hooks
│   │   ├── useSearchDatasets.js
│   │   ├── useDataset.js
│   │   ├── useMyDatasets.js
│   │   ├── useDatasetManagement.js
│   │   ├── useCategories.js
│   │   ├── useRatings.js
│   │   ├── useAccess.js
│   │   └── useDataAdmin.js
│   │
│   ├── payment/                 # Payment service hooks
│   │   ├── useTransactions.js
│   │   ├── useCreateTransaction.js
│   │   ├── usePaymentMethods.js
│   │   ├── useRefunds.js
│   │   ├── useRevenue.js
│   │   └── usePaymentAdmin.js
│   │
│   └── analytics/               # Analytics service hooks
│       ├── useReports.js
│       ├── useCreateReport.js
│       ├── useDashboards.js
│       ├── usePredictions.js
│       ├── useInsights.js
│       ├── useDataQuality.js
│       └── useAnalyticsAdmin.js
│
├── components/                   # Reusable Components
│   ├── routes/                  # Route Protection Components
│   │   └── ProtectedRoute.jsx  # Protected, Role-based, Public routes
│   │
│   ├── identity/                # Identity Components (shared)
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── UserManagement.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── data/                    # Data Components (shared)
│   │   ├── DatasetSearch.jsx
│   │   ├── DatasetDetail.jsx
│   │   └── MyDatasets.jsx
│   │
│   ├── payment/                 # Payment Components (shared)
│   │   ├── TransactionList.jsx
│   │   ├── PaymentMethodForm.jsx
│   │   ├── RefundRequest.jsx
│   │   └── ProviderRevenue.jsx
│   │
│   └── analytics/               # Analytics Components (shared)
│       ├── ReportsList.jsx
│       ├── DashboardManager.jsx
│       ├── PredictionsList.jsx
│       └── DataQualityDashboard.jsx
│
├── layouts/                      # Role-Specific Layouts
│   ├── AdminLayout.jsx          # ADMIN layout with sidebar & navigation
│   ├── ProviderLayout.jsx       # DATA_PROVIDER layout
│   └── ConsumerLayout.jsx       # DATA_CONSUMER layout
│
├── pages/                        # Role-Specific Pages
│   ├── auth/                    # Authentication Pages
│   │   └── LoginPage.jsx        # Login with role detection
│   │
│   ├── admin/                   # ADMIN ONLY Pages
│   │   ├── AdminDashboardPage.jsx
│   │   ├── AdminUsersPage.jsx
│   │   ├── AdminDataPage.jsx
│   │   ├── AdminPaymentsPage.jsx
│   │   └── AdminAnalyticsPage.jsx
│   │
│   ├── provider/                # DATA_PROVIDER ONLY Pages
│   │   ├── ProviderDashboardPage.jsx
│   │   ├── ProviderDatasetsPage.jsx
│   │   ├── ProviderRevenuePage.jsx
│   │   ├── ProviderAnalyticsPage.jsx
│   │   └── ProviderProfilePage.jsx
│   │
│   └── consumer/                # DATA_CONSUMER ONLY Pages
│       ├── ConsumerDashboardPage.jsx
│       ├── ConsumerBrowsePage.jsx
│       ├── ConsumerPurchasesPage.jsx
│       ├── ConsumerTransactionsPage.jsx
│       ├── ConsumerAnalyticsPage.jsx
│       └── ConsumerProfilePage.jsx
│
├── App.jsx                       # Main App with Routing
├── main.jsx                      # App Entry Point
└── index.css                     # Global Styles (TailwindCSS)
```

---

## 🔐 Role-Based Access Control

### 1. **ADMIN Role**
- **Route Prefix:** `/admin/*`
- **Layout:** Red theme, admin-focused navigation
- **Access:**
  - Dashboard with system statistics
  - User management (all users)
  - Data management (all datasets)
  - Payment management (all transactions)
  - Analytics & reports

### 2. **DATA_PROVIDER Role**
- **Route Prefix:** `/provider/*`
- **Layout:** Green theme, provider-focused navigation
- **Access:**
  - Dashboard with provider statistics
  - Upload & manage datasets
  - Revenue tracking
  - Dataset analytics
  - Profile management

### 3. **DATA_CONSUMER Role**
- **Route Prefix:** `/consumer/*`
- **Layout:** Blue theme, consumer-focused navigation
- **Access:**
  - Dashboard with purchase statistics
  - Browse & search datasets
  - My purchases
  - Transaction history
  - Analytics & insights
  - Profile management

---

## 🔄 Authentication Flow

### Login Process:
1. User enters credentials on `/login`
2. `AuthContext.login()` calls API
3. JWT token is decoded to extract user role
4. User is **automatically redirected** to role-specific dashboard:
   - `ADMIN` → `/admin/dashboard`
   - `DATA_PROVIDER` → `/provider/dashboard`
   - `DATA_CONSUMER` → `/consumer/dashboard`

### Token Management:
- Tokens stored in `localStorage`
- Automatic token refresh on 401 errors (in `httpClient.js`)
- JWT decoded to extract: `userId`, `email`, `role`, `fullName`

### Route Protection:
- **PublicRoute:** Redirects authenticated users to their dashboard
- **ProtectedRoute:** Requires authentication
- **RoleProtectedRoute:** Requires specific role, redirects if role mismatch

---

## 🎨 UI Separation by Role

### Layout Differences:

| Feature | Admin | Provider | Consumer |
|---------|-------|----------|----------|
| **Theme Color** | Red/Gray | Green | Blue |
| **Badge** | "ADMIN" | "DATA PROVIDER" | "DATA CONSUMER" |
| **Navigation** | System management | Dataset management | Browse & purchase |
| **Dashboard Stats** | System-wide | Revenue-focused | Purchase-focused |

### Navigation Menus:

**Admin:**
- 📊 Dashboard
- 👥 User Management
- 💾 Data Management
- 💳 Payment Management
- 📈 Analytics
- 📄 Reports

**Provider:**
- 🏠 Dashboard
- 💾 My Datasets
- 💰 Revenue
- 📊 Analytics
- 👤 Profile

**Consumer:**
- 🏠 Dashboard
- 🔍 Browse Datasets
- 🛒 My Purchases
- 💳 Transactions
- 📊 Analytics
- 👤 Profile

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Test Login
The login page has quick login buttons for testing:
- **Admin:** `admin@evdata.com` / `admin123`
- **Provider:** `provider@tesla.com` / `provider123`
- **Consumer:** `consumer@startup.com` / `consumer123`

---

## 🛡️ Security Features

1. **JWT Token Authentication**
   - Stored in localStorage
   - Auto-refresh on expiry
   - Cleared on logout

2. **Route Protection**
   - Role-based access control
   - Automatic redirects for unauthorized access
   - Loading states during auth checks

3. **API Security**
   - Bearer token in all requests
   - Automatic 401 handling
   - Token refresh mechanism

---

## 📋 Key Files Explained

### `AuthContext.jsx`
- Manages global auth state
- Decodes JWT to extract user info
- Handles login/logout
- Provides role-checking utilities

### `ProtectedRoute.jsx`
- Three route types: Public, Protected, RoleProtected
- Handles loading states
- Redirects based on authentication/role

### `App.jsx`
- Main routing configuration
- Nested routes for each role
- Default redirects
- 404 handling

### Layout Files
- Each role has separate layout
- Includes sidebar, navigation, user info
- Role-specific styling
- Logout functionality

---

## 🎯 Features by Role

### Admin Features:
✅ User management (CRUD)
✅ Dataset moderation
✅ Transaction monitoring
✅ Refund management
✅ System analytics
✅ Revenue reports

### Provider Features:
✅ Dataset upload & management
✅ Revenue tracking
✅ Monthly earnings
✅ Dataset analytics
✅ Profile management

### Consumer Features:
✅ Dataset browsing & search
✅ Purchase datasets
✅ Payment methods
✅ Transaction history
✅ Analytics & insights
✅ Profile management

---

## 🔧 Environment Variables

Create `.env` file:
```env
VITE_API_GATEWAY_URL=http://localhost:8080
```

---

## 📱 Responsive Design

- Mobile-friendly layouts
- Collapsible sidebars
- Responsive grids
- Touch-friendly navigation

---

## 🎨 TailwindCSS Classes Used

- Utility-first styling
- Custom color schemes per role
- Responsive breakpoints
- Hover & focus states
- Loading animations

---

## 🔄 State Management

- **Global:** AuthContext (user, authentication)
- **Local:** useState in components
- **API:** Custom hooks for data fetching
- **Caching:** React hooks handle refetching

---

## 📝 Notes

1. **No Interface Merging:** Each role has completely separate pages and layouts
2. **Automatic Role Detection:** Based on JWT token payload
3. **Clear Separation:** Different routes, layouts, and navigation per role
4. **Easy to Extend:** Add new roles by creating new layout + pages
5. **Type Safety:** Using JSDoc comments (JavaScript, not TypeScript)

---

## 🐛 Troubleshooting

**Issue:** User not redirected after login
- Check JWT token format
- Verify role field in token payload
- Check browser console for errors

**Issue:** 404 on protected routes
- Ensure user is logged in
- Verify role matches route requirement
- Check token in localStorage

**Issue:** Layout not loading
- Verify import paths
- Check React Router version compatibility
- Ensure AuthProvider wraps Routes

---

## 📚 Dependencies

- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - Styling
- `vite` - Build tool
