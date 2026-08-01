# Netwise — Kiến thức mạng máy tính

Ứng dụng Next.js tổng hợp kiến thức về mạng máy tính, sử dụng MongoDB và Mongoose.

## Chạy ứng dụng khi phát triển

1. Tạo file môi trường:

   ```powershell
   Copy-Item .env.example .env.local
   ```

2. Khởi động MongoDB:

   ```powershell
   docker compose up -d mongodb
   ```

3. Cài thư viện và chạy Next.js:

   ```powershell
   npm install
   npm run dev
   ```

Mở http://localhost:3000. Kiểm tra MongoDB tại http://localhost:3000/api/health.

Trang quản trị: http://localhost:3000/admin/login

- Email mặc định: `admin@netwise.vn`
- Mật khẩu mặc định: `Netwise@123`

Hãy đổi `ADMIN_PASSWORD` và `AUTH_SECRET` trước khi triển khai. Khi website chạy HTTPS, đặt `AUTH_SECURE_COOKIE=true`. Không có chức năng đăng ký tài khoản.

## Chạy toàn bộ bằng Docker

Sau khi đã có `package-lock.json`:

```powershell
docker compose --profile full up --build
```

## API ban đầu

- `GET /api/health`: kiểm tra kết nối MongoDB.
- `GET /api/articles`: lấy các bài viết đã xuất bản.
- `POST /api/articles`: tạo bài viết mới (yêu cầu đăng nhập admin).
- `PUT /api/articles/:id`: cập nhật bài viết (yêu cầu đăng nhập admin).
- `DELETE /api/articles/:id`: xóa bài viết (yêu cầu đăng nhập admin).
- `POST /api/upload`: tải ảnh tối đa 5MB cho trình soạn thảo.
