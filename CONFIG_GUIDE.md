# 📝 Hướng Dẫn Chỉnh Sửa Thiệp Cưới

## 🎯 File Config Trung Tâm

### 1. Thông tin chung: `src/config.ts`
Chỉnh sửa `src/config.ts` để thay đổi tên cặp đôi, màu sắc và nội dung giao diện. Nội dung giao diện nằm trong `WEDDING_CONFIG.copy`, lịch trình nằm trong `WEDDING_CONFIG.program` và dữ liệu mẫu khách mời/album nằm trong `WEDDING_CONFIG.content`.

Danh sách nhóm khách chỉ gồm `NHÀ TRAI` và `NHÀ GÁI`. Chỉnh giờ đón khách, hôn lễ và đãi tiệc riêng cho mỗi bên trong `WEDDING_CONFIG.guestSchedules.groom` và `WEDDING_CONFIG.guestSchedules.bride`.

### 2. Hình ảnh
Ảnh album nằm trong `WEDDING_CONFIG.content.albumImages` ở `src/config.ts`.
Ảnh bản đồ nằm trong `WEDDING_CONFIG.guestSchedules` (`receptionImagemap`).
Ảnh bìa và ảnh trang trí được đặt trực tiếp tại thuộc tính `src` trong `src/components/InvitationView.tsx` và `src/components/EventDetailsView.tsx`.

## 🔧 Cách Sử Dụng

### Bước 1: Chỉnh sửa config
```typescript
// src/config.ts
couple: {
  brideName: "Tên Cô Dâu",      // Sửa ở đây
  groomName: "Tên Chú Rể",      // Sửa ở đây
}
```

### Bước 2: Chỉnh sửa nội dung hiển thị
Mọi nội dung văn bản giao diện nằm trong `WEDDING_CONFIG.copy` ở `src/config.ts`.
Các nội dung mẫu như danh sách khách, lịch trình và chú thích album nằm trong `WEDDING_CONFIG.content`.
Chỉnh các giá trị này trực tiếp; không cần sửa component. Các thành phần giao diện đọc nội dung từ config.

## 📋 Danh Sách Các Trường Cần Chỉnh Sửa

### Trong `src/config.ts`:
| Trường | Ý nghĩa | Ví dụ |
|--------|---------|-------|
| `couple.brideName` | Tên cô dâu | "Quỳnh Như" |
| `couple.groomName` | Tên chú rể | "Vũ Bảo" |
| `colors.primary` | Màu chủ đạo | "#775a19" |
| `colors.accent` | Màu điểm nhấn | "#c5a059" |
| `copy.app` | Tiêu đề trang và nội dung chân trang | `brand`, `pageTitle` |
| `copy.navigation` | Nhãn menu điều hướng | `invitation`, `details`, `rsvp`, `guests` |
| `copy.invitationView` | Nội dung thiệp mời, album, lời chúc và RSVP nhanh | `invitationTo`, `albumTitle`, `rsvpTitle` |
| `copy.detailsView` | Nội dung trang thông tin sự kiện | `title`, `locationTitle`, `timelineTitle` |
| `copy.rsvpView` | Nhãn, mô tả và lựa chọn trong biểu mẫu RSVP | `name`, `partySize`, `submit` |
| `copy.adminView` | Nội dung trang quản lý khách | `title`, `create`, `searchPlaceholder` |
| `copy.adminView.groupOptions` | Hai nhóm thiệp mời | `NHÀ TRAI`, `NHÀ GÁI` |
| `guestSchedules.groom` | Lịch, địa điểm và bản đồ dành cho khách Nhà trai | `ceremonyTime`, `receptionArrivalTime`, `receptionTime`, `receptionAddressMap` |
| `guestSchedules.bride` | Lịch, địa điểm và bản đồ dành cho khách Nhà gái | `ceremonyTime`, `receptionArrivalTime`, `receptionTime`, `receptionAddressMap` |
| `copy.toast` | Thông báo sau thao tác | `guestAdded`, `rsvpReceived` |
| `content.initialGuests` | Danh sách khách và lời chúc mẫu | Mảng khách mời |
| `program` | Các phần và mốc chương trình theo ngày | `day1`, `day2`, `reception` |
| `content.albumImages` | Chú thích ảnh album | Mảng ảnh |

## ✅ Checklist
- [ ] Sửa tên cặp đôi trong `config.ts`
- [ ] Sửa ngày tháng trong `config.ts`
- [ ] Sửa địa điểm trong `config.ts`
- [ ] Đổi màu sắc nếu muốn trong `config.ts`
- [ ] Thay URL ảnh trong config và các component tương ứng
- [ ] Test lại trang sau khi sửa

## 💡 Mẹo
- Sử dụng màu hex 6 ký tự (#RRGGBB)
- URL ảnh phải là https:// hoặc http://
- Backup file config trước khi sửa hàng loạt
- Dùng ảnh kích thước tương đương để tránh méo hình
