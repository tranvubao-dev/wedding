# Thiệp cưới

Ứng dụng React + TypeScript + Vite, triển khai tĩnh lên GitHub Pages.

## Chạy tại máy

Yêu cầu Node.js 22 và npm.

```sh
npm ci
npm run dev
```

## Kiểm tra và build

```sh
npm run lint
npm run build
npm run preview
```

`build` kiểm tra TypeScript trước khi xuất website vào `dist/`. Ứng dụng không sử dụng Gemini API; kết nối Supabase dùng `.env.local`.

## Triển khai

Xem [hướng dẫn GitHub Pages](GITHUB_PAGES_DEPLOY.md). Workflow `.github/workflows/deploy.yml` tự build và deploy khi push lên `main`.

Xem [hướng dẫn chỉnh sửa](CONFIG_GUIDE.md) để thay thông tin thiệp.

## Supabase

RSVP và lời chúc được lưu vào Supabase. Quản trị đăng nhập bằng email/mật khẩu qua Supabase Auth. Xem [hướng dẫn thiết lập](SUPABASE_SETUP.md) và chạy SQL trong `supabase/schema.sql` trước khi dùng.

Sao chép `.env.example` thành `.env.local`, điền Project URL và publishable key, rồi chạy lại dev server. GitHub Actions cần hai giá trị cấu hình như hướng dẫn; workflow sẽ dừng nếu thiếu cấu hình.

Màu giao diện và lượt thích vẫn lưu cục bộ. Dữ liệu mẫu/cục bộ cũ không tự được tải lên database. Mỗi phản hồi là một bản ghi riêng, không ghi đè theo tên.
