# PowerShell script to check EV Platform status
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   EV Platform Status Check" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Docker is running
try {
    docker version | Out-Null
    Write-Host "[✓] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[✗] Docker is NOT running" -ForegroundColor Red
    exit 1
}

# Define services
$services = @(
    "ev-eureka-server",
    "ev-api-gateway",
    "ev-identity-service",
    "ev-data-service",
    "ev-payment-service",
    "ev-analytics-service",
    "ev-frontend",
    "ev-identity-mysql",
    "ev-data-mysql",
    "ev-payment-mysql",
    "ev-analytics-mysql"
)

Write-Host "`nContainer Status:" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor DarkGray

$runningCount = 0
$totalCount = $services.Count

foreach ($service in $services) {
    try {
        $status = docker inspect $service --format='{{.State.Status}}' 2>$null
        if ($status -eq "running") {
            Write-Host "[✓] $service" -ForegroundColor Green -NoNewline
            Write-Host " - $status" -ForegroundColor Gray
            $runningCount++
        } else {
            Write-Host "[✗] $service" -ForegroundColor Red -NoNewline
            Write-Host " - $status" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[✗] $service" -ForegroundColor Red -NoNewline
        Write-Host " - not found" -ForegroundColor DarkRed
    }
}

Write-Host "`n─────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "Running: $runningCount / $totalCount" -ForegroundColor $(if ($runningCount -eq $totalCount) { "Green" } else { "Yellow" })

# Check if key services are healthy
Write-Host "`nService Health Check:" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor DarkGray

# Check Eureka
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8761/actuator/health" -UseBasicParsing -TimeoutSec 2 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Host "[✓] Eureka Server (8761)" -ForegroundColor Green
    }
} catch {
    Write-Host "[✗] Eureka Server (8761)" -ForegroundColor Red
}

# Check API Gateway
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 2 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Host "[✓] API Gateway (8080)" -ForegroundColor Green
    }
} catch {
    Write-Host "[✗] API Gateway (8080)" -ForegroundColor Red
}

# Check Identity Service via Gateway
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/identity/actuator/health" -UseBasicParsing -TimeoutSec 2 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Host "[✓] Identity Service (via Gateway)" -ForegroundColor Green
    }
} catch {
    Write-Host "[✗] Identity Service (via Gateway)" -ForegroundColor Red
}

# Check Frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost/" -UseBasicParsing -TimeoutSec 2 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Host "[✓] Frontend (80)" -ForegroundColor Green
    }
} catch {
    Write-Host "[✗] Frontend (80)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend:    http://localhost" -ForegroundColor White
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor White
Write-Host "Eureka:      http://localhost:8761" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

