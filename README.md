# Movie Website (React + Node/Express + MySQL)

## Yêu cầu

Chọn 1 trong 2 cách chạy:

### Cách A (Khuyến nghị): Chạy bằng Docker Compose

**Cần cài:** Docker Desktop (bật WSL2).

1) Kiểm tra file cấu hình:
- [.env](.env) (đang có sẵn các biến môi trường)
- [docker-compose.yml](docker-compose.yml)
- [mysql-init-scripts/schema.sql](mysql-init-scripts/schema.sql) (MySQL sẽ tự import khi chạy container lần đầu)

2) Chạy project từ thư mục gốc:

```bash
docker compose up --build
```

3) Truy cập:
- Frontend: `http://localhost` (port 80)
- Backend API: `http://localhost:3001`
- MySQL trên máy host: `localhost:3307` (user `root`, password `1234`, db `web`)

Gỡ toàn bộ container + volume DB (reset dữ liệu):

```bash
docker compose down -v
```

### Cách B: Chạy Local (không Docker)

**Cần cài:** Node.js 18+ và MySQL 8.

#### 1) Chuẩn bị MySQL

- Tạo database `web`
- Import schema mẫu từ [mysql-init-scripts/schema.sql](mysql-init-scripts/schema.sql)

Trong [.env](.env), chỉnh DB để trỏ về local MySQL nếu cần (ví dụ):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=web
```

#### 2) Chạy Backend

Backend nằm ở [backend/server.js](backend/server.js) và dùng biến môi trường trong [.env](.env).

Chạy backend theo 1 trong 2 cách sau:

**Cách 2.1 : chạy từ thư mục gốc để backend đọc được file .env**

```bash
npm install

cd backend
npm install

cd ..
node backend/server.js
```

**Cách 2.2: chạy trong thư mục backend**

- Copy file [.env](.env) thành `backend/.env` rồi chạy:

```bash
cd backend
npm install
npm start
```

Backend mặc định chạy ở `http://localhost:3001`.

#### 3) Chạy Frontend

Mở terminal khác ở thư mục gốc:

```bash
npm install
npm start
```

Frontend sẽ chạy ở `http://localhost:3000`.

---

## 🔐 Cấu hình Bảo mật & Email OTP

Dự án này tích hợp xác thực Email thông qua mã OTP (One-Time Password) cho các tính năng:
- **Đăng ký tài khoản mới**
- **Quên mật khẩu**

### 1. Cấu hình gửi Mail (Nodemailer)
Để tính năng này hoạt động, bạn cần cung cấp thông tin Gmail trong file `.env`:
- `EMAIL_USER`: Địa chỉ Gmail của bạn.
- `EMAIL_PASS`: **Mật khẩu ứng dụng (App Password)** gồm 16 ký tự.
    - *Lưu ý:* Đây KHÔNG phải là mật khẩu đăng nhập Gmail thông thường. Bạn cần vào [Google Account Security](https://myaccount.google.com/security) để tạo App Password.

### 2. Quy tắc độ mạnh mật khẩu
Hệ thống bắt buộc mật khẩu phải đạt các tiêu chuẩn sau:
- Độ dài tối thiểu **6 ký tự**.
- Chứa ít nhất **1 chữ số** (0-9).
- Chứa ít nhất **1 ký tự đặc biệt** (vd: `@, #, $, %, !`).

---

## 🌟 Tính năng chính
- Xem phim, tìm kiếm phim, xem chi tiết phim.
- Hệ thống tập phim (Episodes).
- Đăng nhập/Đăng ký (hỗ trợ Google OAuth).
- Quản lý tài khoản, thay đổi Avatar.
- Bình luận phim (Review).
- Lưu phim yêu thích và lịch sử xem phim.
- Dashboard quản lý phim dành cho Admin.
