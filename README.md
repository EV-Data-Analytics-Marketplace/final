# EV Project - Microservices Platform

Electric Vehicle Data Management & Analytics Platform with Microservices Architecture.

## 🚀 Quick Start - Docker Deployment

### Prerequisites
- Docker Desktop 20.10+
- Docker Compose 2.x+
- Java 17+ (for building)
- 8GB RAM minimum

### Deploy in 3 Steps

#### Option 1: Using Automated Script (Recommended)

**Windows:**
```powershell
.\deploy.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option 2: Manual Deployment

**Step 1: Build JAR files**
```bash
# Windows PowerShell
cd eureka-server; .\mvnw.cmd clean package -DskipTests; cd ..
cd api-gateway; .\mvnw.cmd clean package -DskipTests; cd ..
cd identity-service; .\mvnw.cmd clean package -DskipTests; cd ..
cd data-service; .\mvnw.cmd clean package -DskipTests; cd ..
cd payment-service; .\mvnw.cmd clean package -DskipTests; cd ..
cd analytics-service; .\mvnw.cmd clean package -DskipTests; cd ..

# Linux/Mac
for service in eureka-server api-gateway identity-service data-service payment-service analytics-service; do
    cd $service && ./mvnw clean package -DskipTests && cd ..
done
```

**Step 2: Deploy to Docker**
```bash
docker compose up -d --build
```

**Step 3: Verify Deployment**
```bash
docker compose ps
```

## 📊 Access Services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | React Web Application |
| **Eureka Dashboard** | http://localhost:8761 | Service Registry |
| **API Gateway** | http://localhost:8080 | API Gateway |
| **Identity Service** | http://localhost:8081 | Auth & Users |
| **Data Service** | http://localhost:8082 | Data Management |
| **Payment Service** | http://localhost:8083 | Payments |
| **Analytics Service** | http://localhost:8084 | Analytics |

## 🗄️ Database Access

| Database | Port | Credentials |
|----------|------|-------------|
| Identity DB | 3307 | root/root123 |
| Data DB | 3308 | root/root123 |
| Payment DB | 3309 | root/root123 |
| Analytics DB | 3310 | root/root123 |

## 📚 Documentation

- **[Complete Docker Deployment Guide](DOCKER_DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- **[API Documentation](docs/API.md)** - API endpoints and usage
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System architecture

## 🛠️ Useful Commands

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f identity-service

# Check service status
docker compose ps

# Restart a service
docker compose restart identity-service

# Stop all services
docker compose down

# Stop and remove volumes (reset databases)
docker compose down -v

# View resource usage
docker stats
```

## 🔧 Script Options

### Deploy Script Flags

**Windows (deploy.ps1):**
```powershell
.\deploy.ps1                # Normal deployment
.\deploy.ps1 -SkipBuild     # Skip JAR build, use existing
.\deploy.ps1 -Clean         # Clean deployment (remove volumes)
.\deploy.ps1 -Help          # Show help
```

**Linux/Mac (deploy.sh):**
```bash
./deploy.sh                 # Normal deployment
./deploy.sh --skip-build    # Skip JAR build, use existing
./deploy.sh --clean         # Clean deployment (remove volumes)
./deploy.sh --help          # Show help
```

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │
│  (Port 8080)    │
└────────┬────────┘
         │
    ┌────┴────┬─────────┬──────────┐
    ▼         ▼         ▼          ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌─────────┐
│Identity│ │ Data │ │Payment │ │Analytics│
│Service │ │Service│ │Service │ │ Service │
└───┬────┘ └──┬───┘ └───┬────┘ └────┬────┘
    │         │         │           │
    ▼         ▼         ▼           ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌─────────┐
│MySQL   │ │MySQL │ │MySQL   │ │ MySQL   │
│3307    │ │3308  │ │3309    │ │ 3310    │
└────────┘ └──────┘ └────────┘ └─────────┘
```

All services register with **Eureka Server** (8761) for service discovery.

## ⚡ Performance Tips

1. **Use Pre-built JARs**: Build JARs locally first, then deploy to Docker (5-10x faster)
2. **Increase Docker Resources**: Settings → Resources → Increase memory to 8GB+
3. **Enable BuildKit**: `export DOCKER_BUILDKIT=1`
4. **Use SSD**: Store Docker data on SSD for better performance

## 🐛 Troubleshooting

### Services not starting?
```bash
# Check logs
docker compose logs

# Check specific service
docker logs ev-identity-service
```

### Port conflicts?
```bash
# Windows - Check port usage
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

### Out of disk space?
```bash
# Clean Docker system
docker system prune -a --volumes
```

### Database connection issues?
```bash
# Check database health
docker compose ps

# Wait for databases to be healthy
# MySQL needs ~30 seconds to initialize
```

See [DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md) for detailed troubleshooting.

## 📦 Project Structure

```
EV/
├── eureka-server/          # Service Discovery
├── api-gateway/            # API Gateway
├── identity-service/       # Authentication & Authorization
├── data-service/           # Data Management
├── payment-service/        # Payment Processing
├── analytics-service/      # Analytics & Reporting
├── ev-frontend/            # React Frontend
├── docker-compose.yml      # Docker Compose Configuration
├── deploy.ps1              # Windows Deployment Script
├── deploy.sh               # Linux/Mac Deployment Script
└── DOCKER_DEPLOYMENT_GUIDE.md  # Detailed Guide
```

## 🔐 Security Notes

**⚠️ Default credentials are for DEVELOPMENT only!**

For production:
- Change all database passwords
- Use secrets management
- Enable SSL/TLS
- Configure firewall rules
- Use environment-specific configurations

## 📝 License

[Your License Here]

## 👥 Contributors

[Your Team/Contributors Here]

## 📧 Support

For issues and questions:
- Check [DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md)
- Create an issue on GitHub
- Contact the development team

---

**Last Updated:** November 26, 2025  
**Version:** 1.0.0

