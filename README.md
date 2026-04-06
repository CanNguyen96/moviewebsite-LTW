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
