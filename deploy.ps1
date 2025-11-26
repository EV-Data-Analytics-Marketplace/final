# deploy.ps1 - EV Project Docker Deployment Script
# Author: Auto-generated
# Date: 26/11/2025

param(
    [switch]$SkipBuild,
    [switch]$Clean,
    [switch]$Help
)

function Show-Help {
    Write-Host @"
EV Project Docker Deployment Script

Usage: .\deploy.ps1 [options]

Options:
    -SkipBuild    Skip building JAR files (use existing JARs)
    -Clean        Clean deployment (remove volumes and rebuild)
    -Help         Show this help message

Examples:
    .\deploy.ps1                  # Normal deployment
    .\deploy.ps1 -SkipBuild       # Deploy without rebuilding JARs
    .\deploy.ps1 -Clean           # Clean deployment (reset databases)

"@ -ForegroundColor Cyan
    exit 0
}

if ($Help) {
    Show-Help
}

# Colors
$ColorHeader = "Green"
$ColorStep = "Yellow"
$ColorInfo = "Cyan"
$ColorSuccess = "Green"
$ColorError = "Red"
$ColorWarning = "Magenta"

Write-Host "=============================================" -ForegroundColor $ColorHeader
Write-Host "   EV Project Docker Deployment Script" -ForegroundColor $ColorHeader
Write-Host "=============================================" -ForegroundColor $ColorHeader
Write-Host ""

# Check Docker
Write-Host "[CHECK] Verifying Docker installation..." -ForegroundColor $ColorStep
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor $ColorSuccess

    $composeVersion = docker compose version
    Write-Host "✓ Docker Compose found: $composeVersion" -ForegroundColor $ColorSuccess
} catch {
    Write-Host "✗ Docker not found. Please install Docker Desktop." -ForegroundColor $ColorError
    exit 1
}

# Clean deployment if requested
if ($Clean) {
    Write-Host "`n[CLEAN] Removing existing deployment..." -ForegroundColor $ColorStep
    docker compose down -v
    Write-Host "✓ Cleaned successfully" -ForegroundColor $ColorSuccess
}

# Build JAR files unless skipped
if (-not $SkipBuild) {
    Write-Host "`n[1/3] Building JAR files..." -ForegroundColor $ColorStep
    Write-Host "This may take 2-3 minutes..." -ForegroundColor $ColorInfo

    $services = @(
        "eureka-server",
        "api-gateway",
        "identity-service",
        "data-service",
        "payment-service",
        "analytics-service"
    )

    $startTime = Get-Date
    $totalServices = $services.Count
    $currentService = 0

    foreach ($service in $services) {
        $currentService++
        Write-Host "  [$currentService/$totalServices] Building $service..." -ForegroundColor $ColorInfo

        Push-Location $service
        try {
            $output = .\mvnw.cmd clean package -DskipTests -q 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-Host "    ✗ Failed to build $service" -ForegroundColor $ColorError
                Write-Host "    Error output: $output" -ForegroundColor $ColorError
                Pop-Location
                exit 1
            }
            Write-Host "    ✓ $service built successfully" -ForegroundColor $ColorSuccess
        } finally {
            Pop-Location
        }
    }

    $buildDuration = (Get-Date) - $startTime
    Write-Host "`n✓ All JAR files built in $([math]::Round($buildDuration.TotalMinutes, 2)) minutes" -ForegroundColor $ColorSuccess

    # Verify JARs
    Write-Host "`n[2/3] Verifying JAR files..." -ForegroundColor $ColorStep
    $jars = Get-ChildItem -Path .\*\target\*.jar -Recurse | Where-Object { $_.Name -notlike "*.original" }

    if ($jars.Count -eq $totalServices) {
        Write-Host "✓ Found all $($jars.Count) JAR files:" -ForegroundColor $ColorSuccess
        foreach ($jar in $jars) {
            $size = [math]::Round($jar.Length / 1MB, 2)
            Write-Host "    - $($jar.Name) ($size MB)" -ForegroundColor $ColorInfo
        }
    } else {
        Write-Host "✗ Expected $totalServices JAR files, found $($jars.Count)" -ForegroundColor $ColorError
        exit 1
    }
} else {
    Write-Host "`n[SKIP] Skipping JAR build..." -ForegroundColor $ColorWarning
}

# Deploy to Docker
Write-Host "`n[3/3] Deploying to Docker..." -ForegroundColor $ColorStep
Write-Host "Building and starting containers..." -ForegroundColor $ColorInfo

$deployStartTime = Get-Date
docker compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker deployment failed" -ForegroundColor $ColorError
    exit 1
}

$deployDuration = (Get-Date) - $deployStartTime
Write-Host "✓ Docker containers started in $([math]::Round($deployDuration.TotalSeconds, 2)) seconds" -ForegroundColor $ColorSuccess

# Wait for services to initialize
Write-Host "`n[WAIT] Waiting for services to initialize (30 seconds)..." -ForegroundColor $ColorStep
for ($i = 30; $i -gt 0; $i--) {
    Write-Progress -Activity "Initializing services" -Status "$i seconds remaining" -PercentComplete ((30 - $i) / 30 * 100)
    Start-Sleep -Seconds 1
}
Write-Progress -Activity "Initializing services" -Completed

# Check deployment status
Write-Host "`n=============================================" -ForegroundColor $ColorHeader
Write-Host "         Deployment Status" -ForegroundColor $ColorHeader
Write-Host "=============================================" -ForegroundColor $ColorHeader

docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# Count running containers
$runningContainers = docker compose ps --format json | ConvertFrom-Json | Where-Object { $_.State -eq "running" }
$totalContainers = docker compose ps --format json | ConvertFrom-Json

Write-Host "`n✓ Running: $($runningContainers.Count)/$($totalContainers.Count) containers" -ForegroundColor $ColorSuccess

# Service URLs
Write-Host "`n=============================================" -ForegroundColor $ColorHeader
Write-Host "         Service URLs" -ForegroundColor $ColorHeader
Write-Host "=============================================" -ForegroundColor $ColorHeader
Write-Host "Eureka Dashboard:   http://localhost:8761" -ForegroundColor $ColorInfo
Write-Host "Frontend:           http://localhost" -ForegroundColor $ColorInfo
Write-Host "API Gateway:        http://localhost:8080" -ForegroundColor $ColorInfo
Write-Host "Identity Service:   http://localhost:8081" -ForegroundColor $ColorInfo
Write-Host "Data Service:       http://localhost:8082" -ForegroundColor $ColorInfo
Write-Host "Payment Service:    http://localhost:8083" -ForegroundColor $ColorInfo
Write-Host "Analytics Service:  http://localhost:8084" -ForegroundColor $ColorInfo

# Database connections
Write-Host "`n=============================================" -ForegroundColor $ColorHeader
Write-Host "         Database Connections" -ForegroundColor $ColorHeader
Write-Host "=============================================" -ForegroundColor $ColorHeader
Write-Host "Identity DB:        localhost:3307" -ForegroundColor $ColorInfo
Write-Host "Data DB:            localhost:3308" -ForegroundColor $ColorInfo
Write-Host "Payment DB:         localhost:3309" -ForegroundColor $ColorInfo
Write-Host "Analytics DB:       localhost:3310" -ForegroundColor $ColorInfo
Write-Host "Username:           root" -ForegroundColor $ColorInfo
Write-Host "Password:           root123" -ForegroundColor $ColorInfo

# Quick health check
Write-Host "`n[HEALTH] Performing quick health checks..." -ForegroundColor $ColorStep

$healthChecks = @(
    @{Name="Eureka"; Url="http://localhost:8761"},
    @{Name="Frontend"; Url="http://localhost"},
    @{Name="API Gateway"; Url="http://localhost:8080/actuator/health"}
)

foreach ($check in $healthChecks) {
    try {
        $response = Invoke-WebRequest -Uri $check.Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ $($check.Name): OK" -ForegroundColor $ColorSuccess
        }
    } catch {
        Write-Host "  ⚠ $($check.Name): Not ready yet (may need more time)" -ForegroundColor $ColorWarning
    }
}

# Summary
$totalDuration = (Get-Date) - $startTime
Write-Host "`n=============================================" -ForegroundColor $ColorHeader
Write-Host "         Deployment Complete!" -ForegroundColor $ColorHeader
Write-Host "=============================================" -ForegroundColor $ColorHeader
Write-Host "Total time: $([math]::Round($totalDuration.TotalMinutes, 2)) minutes" -ForegroundColor $ColorSuccess
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor $ColorInfo
Write-Host "  docker compose logs -f              # View all logs" -ForegroundColor $ColorInfo
Write-Host "  docker compose ps                   # View status" -ForegroundColor $ColorInfo
Write-Host "  docker compose down                 # Stop all services" -ForegroundColor $ColorInfo
Write-Host "  docker compose down -v              # Stop and remove volumes" -ForegroundColor $ColorInfo
Write-Host "  docker compose restart <service>    # Restart a service" -ForegroundColor $ColorInfo
Write-Host ""

