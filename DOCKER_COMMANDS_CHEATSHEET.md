# 📋 Docker Commands Quick Reference

## 🚀 Deployment

```bash
# Deploy lần đầu (Windows)
.\deploy.ps1

# Deploy lần đầu (Linux/Mac)
./deploy.sh

# Deploy nhanh (đã có JAR)
.\deploy.ps1 -SkipBuild           # Windows
./deploy.sh --skip-build          # Linux/Mac

# Deploy mới hoàn toàn
.\deploy.ps1 -Clean               # Windows
./deploy.sh --clean               # Linux/Mac
```

---

## 📊 Monitoring

```bash
# Xem tất cả containers
docker compose ps

# Xem logs tất cả services
docker compose logs -f

# Xem logs một service
docker compose logs -f identity-service

# Xem 100 dòng cuối
docker compose logs --tail 100 identity-service

# Xem resource usage
docker stats

# Xem network
docker network inspect ev_ev-network
```

---

## 🔄 Management

```bash
# Restart một service
docker compose restart identity-service

# Restart tất cả
docker compose restart

# Stop tất cả
docker compose down

# Stop và xóa volumes
docker compose down -v

# Rebuild một service
docker compose up -d --build identity-service

# Scale service
docker compose up -d --scale data-service=2
```

---

## 🗄️ Database

```bash
# Kết nối MySQL
docker exec -it ev-identity-mysql mysql -uroot -proot123 ev_identity_db
docker exec -it ev-data-mysql mysql -uroot -proot123 ev_data_db
docker exec -it ev-payment-mysql mysql -uroot -proot123 ev_payment_db
docker exec -it ev-analytics-mysql mysql -uroot -proot123 ev_analytics_db

# Backup database
docker exec ev-identity-mysql mysqldump -uroot -proot123 ev_identity_db > backup.sql

# Restore database
docker exec -i ev-identity-mysql mysql -uroot -proot123 ev_identity_db < backup.sql

# Xem databases
docker exec ev-identity-mysql mysql -uroot -proot123 -e "SHOW DATABASES;"

# Xem tables
docker exec ev-identity-mysql mysql -uroot -proot123 ev_identity_db -e "SHOW TABLES;"
```

---

## 🧹 Cleanup

```bash
# Xóa unused images
docker image prune -a

# Xóa unused volumes
docker volume prune

# Xóa unused networks
docker network prune

# Xóa tất cả unused
docker system prune -a --volumes

# Xem disk usage
docker system df
```

---

## 🔍 Debugging

```bash
# Exec vào container
docker exec -it ev-identity-service sh

# Xem processes trong container
docker top ev-identity-service

# Xem container details
docker inspect ev-identity-service

# Xem port mapping
docker port ev-identity-service

# Copy file từ container
docker cp ev-identity-service:/app/logs/app.log ./

# Copy file vào container
docker cp ./config.yml ev-identity-service:/app/
```

---

## 🌐 Health Checks

```bash
# Eureka Dashboard
curl http://localhost:8761

# API Gateway Health
curl http://localhost:8080/actuator/health

# Identity Service Health
curl http://localhost:8081/actuator/health

# Data Service Health
curl http://localhost:8082/actuator/health

# Payment Service Health
curl http://localhost:8083/actuator/health

# Analytics Service Health
curl http://localhost:8084/actuator/health

# Frontend
curl http://localhost
```

---

## 📦 Images

```bash
# Xem tất cả images
docker images

# Xóa image
docker rmi ev-identity-service

# Build image
docker build -t ev-identity-service ./identity-service

# Tag image
docker tag ev-identity-service:latest ev-identity-service:v1.0.0

# Push image (nếu có registry)
docker push your-registry/ev-identity-service:latest
```

---

## 🔌 Network

```bash
# Xem networks
docker network ls

# Inspect network
docker network inspect ev_ev-network

# Xem containers trong network
docker network inspect ev_ev-network --format '{{range .Containers}}{{.Name}} {{end}}'

# Test connectivity
docker exec ev-identity-service ping ev-identity-mysql
docker exec ev-api-gateway ping eureka-server
```

---

## 💾 Volumes

```bash
# Xem volumes
docker volume ls

# Inspect volume
docker volume inspect ev_mysql-identity-data

# Xóa volume
docker volume rm ev_mysql-identity-data

# Backup volume
docker run --rm -v ev_mysql-identity-data:/data -v $(pwd):/backup alpine tar czf /backup/identity-data-backup.tar.gz /data

# Restore volume
docker run --rm -v ev_mysql-identity-data:/data -v $(pwd):/backup alpine tar xzf /backup/identity-data-backup.tar.gz -C /
```

---

## ⚡ Quick Fixes

```bash
# Service không start?
docker compose logs <service-name>
docker compose restart <service-name>

# Port conflict?
# Windows
netstat -ano | findstr :<port>
# Linux/Mac
lsof -i :<port>

# Database không connect?
docker compose ps                    # Check if healthy
docker compose restart <db-service>

# Out of memory?
docker system prune -a
# Hoặc tăng Docker Desktop memory

# Rebuild từ đầu
docker compose down -v
docker compose up -d --build --force-recreate
```

---

## 📱 Shortcuts

### PowerShell Aliases (Windows)
```powershell
# Thêm vào $PROFILE
function dcup { docker compose up -d --build }
function dcdown { docker compose down }
function dcps { docker compose ps }
function dclogs { docker compose logs -f }
function dcrestart { docker compose restart $args }
```

### Bash Aliases (Linux/Mac)
```bash
# Thêm vào ~/.bashrc hoặc ~/.zshrc
alias dcup='docker compose up -d --build'
alias dcdown='docker compose down'
alias dcps='docker compose ps'
alias dclogs='docker compose logs -f'
alias dcrestart='docker compose restart'
```

---

## 🎯 Common Workflows

### Deploy mới hoàn toàn
```bash
docker compose down -v
.\deploy.ps1                # Windows
./deploy.sh                 # Linux/Mac
```

### Update một service
```bash
cd identity-service
.\mvnw.cmd clean package -DskipTests    # Windows
./mvnw clean package -DskipTests        # Linux/Mac
cd ..
docker compose up -d --build identity-service
```

### Check toàn bộ hệ thống
```bash
docker compose ps
docker stats --no-stream
docker compose logs --tail 20
```

### Troubleshoot service
```bash
docker compose logs -f identity-service
docker exec -it ev-identity-service sh
docker inspect ev-identity-service
```

---

**Print hoặc bookmark trang này để tra cứu nhanh!**

