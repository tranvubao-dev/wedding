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

`build` kiểm tra TypeScript trước khi xuất website vào `dist/`. Ứng dụng hiện không sử dụng Gemini API và không cần `.env`.

## Triển khai

Xem [hướng dẫn GitHub Pages](GITHUB_PAGES_DEPLOY.md). Workflow `.github/workflows/deploy.yml` tự build và deploy khi push lên `main`.

Xem [hướng dẫn chỉnh sửa](CONFIG_GUIDE.md) để thay thông tin thiệp.

## Dữ liệu hiện tại

Khách mời, RSVP, lời chúc, lượt thích và màu tùy chỉnh chỉ lưu trong trình duyệt hiện tại (localStorage), không đồng bộ giữa thiết bị. Khi trình duyệt chặn lưu trữ, dữ liệu chỉ còn trong bộ nhớ trong phiên sử dụng. Muốn nhận phản hồi từ khách trên các thiết bị khác cần tích hợp backend hoặc dịch vụ biểu mẫu.

Mã PIN admin được kiểm tra ở phía trình duyệt và có trong source; đây chỉ là khóa giao diện, không phải cơ chế bảo vệ dữ liệu bí mật.
