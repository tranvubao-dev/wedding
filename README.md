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

Màu giao diện lưu cục bộ. Lượt tim lời chúc lưu chung trên Supabase, tự cập nhật mỗi 15 giây khi trang đang mở. Dữ liệu mẫu/cục bộ cũ không tự được tải lên database. Mỗi phản hồi là một bản ghi riêng, không ghi đè theo tên.

## Format code tự động

Cài extension **Prettier - Code formatter** (`esbenp.prettier-vscode`) trong VS Code hoặc Cursor. Workspace đã bật `editor.formatOnSave`: nhấn lưu để tự format theo `.prettierrc.json` (thụt 2 dấu cách, dùng dấu nháy đơn trong JS/TS, dấu chấm phẩy, độ dài dòng ưu tiên 100 ký tự).

- `npm run format`: format toàn bộ các file được hỗ trợ trong dự án.
- `npm run format:check`: kiểm tra định dạng mà không thay đổi file.

Thư mục build, assets, dữ liệu handoff, file môi trường và lockfile được bỏ qua qua `.prettierignore`. SQL không được Prettier mặc định hỗ trợ; cấu hình này không thêm formatter SQL.

## Link thiệp ngắn

Copy Link trong trang quản trị tạo mã 8 ký tự dùng cùng tên miền (`?i=...`). Database hiện có cần chạy `supabase/migrations/20261109_short_invitations.sql`; xem `SUPABASE_SETUP.md`. Link cũ vẫn được hỗ trợ. `npm run test:supabase` kiểm tra SQL lượt tim và mã thiệp bằng database cục bộ, không kết nối dữ liệu thật.
