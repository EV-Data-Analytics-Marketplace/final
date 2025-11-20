================================================================================
                    EV PLATFORM - HƯỚNG DẪN CÀI ĐẶT
================================================================================

🎯 QUICK START - BẮT ĐẦU NHANH
================================================================================

1. Cài Docker Desktop
   - Download: https://www.docker.com/products/docker-desktop
   - Cài đặt và khởi động Docker Desktop
   - Đợi Docker khởi động xong (biểu tượng trong system tray)

2. Mở Terminal/Command Prompt
   - Windows: Nhấn Windows + R, gõ "cmd", Enter
   - macOS: Mở Terminal từ Applications
   - Linux: Mở Terminal

3. Di chuyển vào thư mục project
   cd path/to/ev-platform

4. Chạy lệnh deploy

   WINDOWS:
   quick-deploy.bat

   macOS/LINUX:
   chmod +x quick-deploy.sh
   ./quick-deploy.sh

5. Đợi 15-20 phút (lần đầu build)

6. Mở browser và truy cập:
   http://localhost

7. Đăng nhập:
   Email: admin@evdata.com
   Password: password

================================================================================
📋 YÊU CẦU HỆ THỐNG
================================================================================

✓ RAM: 8GB trở lên
✓ Ổ cứng: 10GB trống
✓ Docker Desktop phiên bản 4.0+
✓ Kết nối internet (để download images lần đầu)

================================================================================
🌐 DANH SÁCH SERVICES
================================================================================

Frontend:         http://localhost
API Gateway:      http://localhost:8080
Eureka Dashboard: http://localhost:8761

Identity Service: http://localhost:8081
Data Service:     http://localhost:8082
Payment Service:  http://localhost:8083
Analytics Service: http://localhost:8084

================================================================================
🔑 TÀI KHOẢN ĐĂNG NHẬP
================================================================================

Admin:
  Email:    admin@evdata.com
  Password: password
  Quyền:    Toàn bộ hệ thống

================================================================================
🛑 DỪNG HỆ THỐNG
================================================================================

Dừng tất cả services:
  docker-compose down

Dừng và xóa tất cả data:
  docker-compose down -v

================================================================================
✅ KIỂM TRA HỆ THỐNG
================================================================================

1. Xem containers đang chạy:
   docker ps

   Phải thấy 11 containers:
   - ev-eureka-server
   - ev-api-gateway
   - ev-identity-service
   - ev-data-service
   - ev-payment-service
   - ev-analytics-service
   - ev-frontend
   - ev-identity-mysql
   - ev-data-mysql
   - ev-payment-mysql
   - ev-analytics-mysql

2. Kiểm tra Eureka:
   Mở http://localhost:8761
   Phải thấy 5 services đã registered

3. Xem logs:
   docker-compose logs -f

================================================================================
❌ XỬ LÝ LỖI THƯỜNG GẶP
================================================================================

LỖI 1: "Docker is not running"
→ Giải pháp: Mở Docker Desktop và đợi khởi động xong

LỖI 2: "Port already in use"
→ Giải pháp:
  Windows:
    netstat -ano | findstr :80
    taskkill /PID <số_PID> /F

  macOS/Linux:
    lsof -i :80
    kill -9 <PID>

LỖI 3: Login failed (401)
→ Giải pháp:
  - Đảm bảo dùng password: "password" (KHÔNG phải "admin123")
  - Clear browser cache: Ctrl+Shift+Delete
  - Hard reload: Ctrl+Shift+R

LỖI 4: "Eureka Server unhealthy"
→ Giải pháp:
  docker restart ev-eureka-server
  Đợi 30 giây
  docker-compose up -d

LỖI 5: Frontend không load
→ Giải pháp:
  docker-compose build --no-cache ev-frontend
  docker-compose up -d ev-frontend
  Clear cache trong browser (Ctrl+Shift+Delete)
  Hard reload (Ctrl+Shift+R)

================================================================================
📚 TÀI LIỆU CHI TIẾT
================================================================================

INSTALLATION-GUIDE.md  - Hướng dẫn cài đặt đầy đủ (khuyến nghị đọc)
QUICK-START.md         - Hướng dẫn bắt đầu nhanh
SUCCESS.md             - Chi tiết về login và cấu hình
README.md              - Tổng quan về project

================================================================================
🔧 LỆNH HỮU ÍCH
================================================================================

Khởi động lại một service:
  docker-compose restart <tên-service>

Xem logs của service:
  docker logs <tên-container>

Rebuild một service:
  docker-compose build <tên-service>
  docker-compose up -d <tên-service>

Xóa tất cả và bắt đầu lại:
  docker-compose down -v
  docker-compose build --no-cache
  docker-compose up -d

Xem resource usage:
  docker stats

================================================================================
🆘 CẦN TRỢ GIÚP?
================================================================================

1. Kiểm tra logs:
   docker-compose logs > debug.log
   (Gửi file debug.log khi báo lỗi)

2. Chạy script kiểm tra:
   Windows: .\check-status.ps1
   macOS/Linux: ./check-status.sh

3. Đọc INSTALLATION-GUIDE.md để biết thêm chi tiết

================================================================================
✨ CHECKLIST SAU KHI CÀI ĐẶT
================================================================================

[ ] Docker Desktop đang chạy
[ ] 11 containers đều có status "Up"
[ ] Eureka Dashboard accessible (http://localhost:8761)
[ ] 5 services đã registered trong Eureka
[ ] Frontend accessible (http://localhost)
[ ] Login thành công
[ ] Redirect đến dashboard
[ ] Không có errors trong browser console (F12)

================================================================================
🎉 CHÚC MỪNG!
================================================================================

Nếu tất cả checklist đã hoàn thành, bạn đã cài đặt thành công EV Platform!

Chúc bạn code vui vẻ! 🚀

================================================================================
Ngày tạo: November 18, 2025
Phiên bản: 1.0
================================================================================

