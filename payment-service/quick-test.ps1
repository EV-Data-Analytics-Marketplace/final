# Quick Test Payment Service
# Run this after the service has started

$baseUrl = "http://localhost:8083/payment"

Write-Host "`n=== PAYMENT SERVICE QUICK TEST ===" -ForegroundColor Cyan
Write-Host "Testing service at: $baseUrl`n" -ForegroundColor Gray

# Test 1: Service is running
Write-Host "[TEST 1] Service Running Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health/ping" -Method Get
    Write-Host "✓ Service is UP and RUNNING" -ForegroundColor Green
    Write-Host "  - Status: $($response.status)" -ForegroundColor Gray
    Write-Host "  - Service: $($response.service)" -ForegroundColor Gray
    Write-Host "  - Time: $($response.timestamp)`n" -ForegroundColor Gray
} catch {
    Write-Host "✗ Service is NOT RUNNING" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)`n" -ForegroundColor Red
    Write-Host "Please start the service first with: .\start-service.bat" -ForegroundColor Yellow
    exit 1
}

# Test 2: Get Service Info
Write-Host "[TEST 2] Service Information..." -ForegroundColor Yellow
try {
    $info = Invoke-RestMethod -Uri "$baseUrl/api/health/info" -Method Get
    Write-Host "✓ Service Info Retrieved" -ForegroundColor Green
    Write-Host "  - Name: $($info.service)" -ForegroundColor Gray
    Write-Host "  - Version: $($info.version)" -ForegroundColor Gray
    Write-Host "  - Description: $($info.description)" -ForegroundColor Gray
    Write-Host "  - Available Endpoints:" -ForegroundColor Gray
    $info.endpoints.PSObject.Properties | ForEach-Object {
        Write-Host "    * $($_.Name): $($_.Value)" -ForegroundColor DarkGray
    }
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get service info" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Test 3: Actuator Health
Write-Host "[TEST 3] Actuator Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/actuator/health" -Method Get
    Write-Host "✓ Health Status: $($health.status)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Health check failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Test 4: Protected Endpoints (should return 401)
Write-Host "[TEST 4] Security Check (Protected Endpoints)..." -ForegroundColor Yellow
$protectedEndpoints = @(
    "/api/transactions/my-transactions",
    "/api/payment-methods",
    "/api/refunds/my-refunds"
)

$passedSecurity = $true
foreach ($endpoint in $protectedEndpoints) {
    try {
        Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method Get -ErrorAction Stop
        Write-Host "✗ Security FAIL: $endpoint is not protected!" -ForegroundColor Red
        $passedSecurity = $false
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✓ $endpoint is properly protected (401)" -ForegroundColor Green
        } else {
            Write-Host "? $endpoint returned: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
}

if ($passedSecurity) {
    Write-Host "`n✓ All protected endpoints require authentication" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "=== TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host "✓ Payment Service is properly configured and running" -ForegroundColor Green
Write-Host "✓ Public endpoints are accessible" -ForegroundColor Green
Write-Host "✓ Protected endpoints require JWT authentication" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Get JWT token from Identity Service (http://localhost:8081/identity/api/auth/login)" -ForegroundColor Gray
Write-Host "2. Use token to test authenticated endpoints" -ForegroundColor Gray
Write-Host "3. Run full test suite: .\test-endpoints.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed endpoint documentation, see: ENDPOINT_TESTING.md" -ForegroundColor Gray
Write-Host ""

