# Script test các endpoint của Payment Service
# Chạy script này sau khi service đã khởi động

$baseUrl = "http://localhost:8083/payment"

Write-Host "=== PAYMENT SERVICE ENDPOINT TEST ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check (không cần auth)
Write-Host "1. Testing Health Endpoints (Public Access)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/actuator/health" -Method Get -ErrorAction Stop
    Write-Host "   ✓ Actuator Health: $($response.StatusCode) - SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Actuator Health FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health/ping" -Method Get -ErrorAction Stop
    Write-Host "   ✓ Health Ping: $($response.StatusCode) - SUCCESS" -ForegroundColor Green
    $content = $response.Content | ConvertFrom-Json
    Write-Host "      Message: $($content.message)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Health Ping FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health/info" -Method Get -ErrorAction Stop
    Write-Host "   ✓ Health Info: $($response.StatusCode) - SUCCESS" -ForegroundColor Green
    $content = $response.Content | ConvertFrom-Json
    Write-Host "      Service: $($content.service) v$($content.version)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Health Info FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Transaction endpoints (cần auth - expect 401)
Write-Host "2. Testing Transaction Endpoints (expect 401 Unauthorized)..." -ForegroundColor Yellow
$transactionEndpoints = @(
    @{Method="GET"; Path="/api/transactions/my-transactions"; Name="Get My Transactions"}
    @{Method="POST"; Path="/api/transactions"; Name="Create Transaction"}
    @{Method="GET"; Path="/api/transactions/consumer"; Name="Get Consumer Transactions"}
    @{Method="GET"; Path="/api/transactions/provider"; Name="Get Provider Transactions"}
)

foreach ($endpoint in $transactionEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$($endpoint.Path)" -Method $endpoint.Method -ErrorAction Stop
        Write-Host "   ✗ $($endpoint.Name): Got $($response.StatusCode) - Should be 401" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "   ✓ $($endpoint.Name): 401 Unauthorized - CORRECT" -ForegroundColor Green
        } else {
            Write-Host "   ? $($endpoint.Name): $($_.Exception.Response.StatusCode) - $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Test 3: Payment Method endpoints
Write-Host "3. Testing Payment Method Endpoints (expect 401)..." -ForegroundColor Yellow
$paymentMethodEndpoints = @(
    @{Method="GET"; Path="/api/payment-methods"; Name="Get Payment Methods"}
    @{Method="POST"; Path="/api/payment-methods"; Name="Add Payment Method"}
)

foreach ($endpoint in $paymentMethodEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$($endpoint.Path)" -Method $endpoint.Method -ErrorAction Stop
        Write-Host "   ✗ $($endpoint.Name): Got $($response.StatusCode) - Should be 401" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "   ✓ $($endpoint.Name): 401 Unauthorized - CORRECT" -ForegroundColor Green
        } else {
            Write-Host "   ? $($endpoint.Name): $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Test 4: Refund endpoints
Write-Host "4. Testing Refund Endpoints (expect 401)..." -ForegroundColor Yellow
$refundEndpoints = @(
    @{Method="GET"; Path="/api/refunds/my-refunds"; Name="Get My Refunds"}
    @{Method="POST"; Path="/api/refunds"; Name="Create Refund Request"}
)

foreach ($endpoint in $refundEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$($endpoint.Path)" -Method $endpoint.Method -ErrorAction Stop
        Write-Host "   ✗ $($endpoint.Name): Got $($response.StatusCode) - Should be 401" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "   ✓ $($endpoint.Name): 401 Unauthorized - CORRECT" -ForegroundColor Green
        } else {
            Write-Host "   ? $($endpoint.Name): $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Test 5: Revenue endpoints (DATA_PROVIDER required)
Write-Host "5. Testing Revenue Endpoints (expect 401)..." -ForegroundColor Yellow
$revenueEndpoints = @(
    @{Method="GET"; Path="/api/revenue/my-revenue"; Name="Get My Revenue"}
    @{Method="GET"; Path="/api/revenue/total-earnings"; Name="Get Total Earnings"}
)

foreach ($endpoint in $revenueEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$($endpoint.Path)" -Method $endpoint.Method -ErrorAction Stop
        Write-Host "   ✗ $($endpoint.Name): Got $($response.StatusCode) - Should be 401" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "   ✓ $($endpoint.Name): 401 Unauthorized - CORRECT" -ForegroundColor Green
        } else {
            Write-Host "   ? $($endpoint.Name): $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Test 6: Admin endpoints
Write-Host "6. Testing Admin Endpoints (expect 401)..." -ForegroundColor Yellow
$adminEndpoints = @(
    @{Method="GET"; Path="/api/admin/payment/stats"; Name="Get Payment Stats"}
    @{Method="GET"; Path="/api/admin/payment/transactions"; Name="Get All Transactions"}
    @{Method="GET"; Path="/api/admin/payment/refunds"; Name="Get All Refunds"}
    @{Method="GET"; Path="/api/admin/payment/provider-revenues"; Name="Get Provider Revenues"}
)

foreach ($endpoint in $adminEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$($endpoint.Path)" -Method $endpoint.Method -ErrorAction Stop
        Write-Host "   ✗ $($endpoint.Name): Got $($response.StatusCode) - Should be 401" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "   ✓ $($endpoint.Name): 401 Unauthorized - CORRECT" -ForegroundColor Green
        } else {
            Write-Host "   ? $($endpoint.Name): $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

Write-Host "=== TEST COMPLETED ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Để test với authentication, cần có JWT token từ Identity Service" -ForegroundColor Gray

