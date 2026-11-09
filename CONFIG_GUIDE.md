# 📝 Hướng Dẫn Chỉnh Sửa Thiệp Cưới

## 🎯 File Config Trung Tâm

### 1. Thông tin chung: `src/config.ts`

Chỉnh sửa `src/config.ts` để thay đổi tên cặp đôi, màu sắc và nội dung giao diện. Nội dung giao diện nằm trong `WEDDING_CONFIG.copy`, lịch trình nằm trong `WEDDING_CONFIG.program` và dữ liệu mẫu khách mời/album nằm trong `WEDDING_CONFIG.content`.

Danh sách nhóm khách chỉ gồm `NHÀ TRAI` và `NHÀ GÁI`. Chỉnh giờ đón khách, hôn lễ và đãi tiệc riêng cho mỗi bên trong `WEDDING_CONFIG.guestSchedules.groom` và `WEDDING_CONFIG.guestSchedules.bride`.

### 2. Hình ảnh

Ảnh album nằm trong `WEDDING_CONFIG.content.albumImages` ở `src/config.ts`.
Ảnh bản đồ nằm trong `WEDDING_CONFIG.guestSchedules` (`receptionImagemap`).
Ảnh bìa và ảnh minh họa nằm trong `WEDDING_CONFIG.images` ở `src/config.ts`:

| Trường                      | Ảnh sử dụng                                    |
| --------------------------- | ---------------------------------------------- |
| `images.invitationHero`     | Ảnh bìa thiệp mời                              |
| `images.invitationPortrait` | Ảnh chân dung trong thiệp mời (`8_rnbon0.png`) |
| `images.eventHero`          | Ảnh bìa chi tiết sự kiện                       |
| `images.rsvpInvitation`     | Ảnh thiệp minh họa RSVP                        |
| `images.rsvpReception`      | Ảnh bàn tiệc minh họa RSVP                     |
| `images.adminPreview`       | Ảnh minh họa trang quản lý khách               |

Chỉ cần thay URL trong config; component tự đọc giá trị mới.

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

| Trường                        | Ý nghĩa                                           | Ví dụ                                                                          |
| ----------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| `couple.brideName`            | Tên cô dâu                                        | "Quỳnh Như"                                                                    |
| `couple.groomName`            | Tên chú rể                                        | "Vũ Bảo"                                                                       |
| `colors.primary`              | Màu chủ đạo                                       | "#775a19"                                                                      |
| `colors.accent`               | Màu điểm nhấn                                     | "#c5a059"                                                                      |
| `copy.app`                    | Tiêu đề trang và nội dung chân trang              | `brand`, `pageTitle`                                                           |
| `copy.navigation`             | Nhãn menu điều hướng                              | `invitation`, `details`, `rsvp`, `guests`                                      |
| `copy.invitationView`         | Nội dung thiệp mời, album, lời chúc và RSVP nhanh | `invitationTo`, `albumTitle`, `rsvpTitle`                                      |
| `copy.detailsView`            | Nội dung trang thông tin sự kiện                  | `title`, `locationTitle`, `timelineTitle`                                      |
| `copy.rsvpView`               | Nhãn, mô tả và lựa chọn trong biểu mẫu RSVP       | `name`, `partySize`, `submit`                                                  |
| `copy.adminView`              | Nội dung trang quản lý khách                      | `title`, `create`, `searchPlaceholder`                                         |
| `copy.adminView.groupOptions` | Hai nhóm thiệp mời                                | `NHÀ TRAI`, `NHÀ GÁI`                                                          |
| `guestSchedules.groom`        | Lịch, địa điểm và bản đồ dành cho khách Nhà trai  | `ceremonyTime`, `receptionArrivalTime`, `receptionTime`, `receptionAddressMap` |
| `guestSchedules.bride`        | Lịch, địa điểm và bản đồ dành cho khách Nhà gái   | `ceremonyTime`, `receptionArrivalTime`, `receptionTime`, `receptionAddressMap` |
| `copy.toast`                  | Thông báo sau thao tác                            | `guestAdded`, `rsvpReceived`                                                   |
| `content.initialGuests`       | Danh sách khách và lời chúc mẫu                   | Mảng khách mời                                                                 |
| `program`                     | Các phần và mốc chương trình theo ngày            | `day1`, `day2`, `reception`                                                    |
| `content.albumImages`         | Chú thích ảnh album                               | Mảng ảnh                                                                       |

## ✅ Checklist

- [ ] Sửa tên cặp đôi trong `config.ts`
- [ ] Sửa ngày tháng trong `config.ts`
- [ ] Sửa địa điểm trong `config.ts`
- [ ] Đổi màu sắc nếu muốn trong `config.ts`
- [ ] Thay URL ảnh trong `config.ts`
- [ ] Test lại trang sau khi sửa

## 💡 Mẹo

- Sử dụng màu hex 6 ký tự (#RRGGBB)
- URL ảnh phải là https:// hoặc http://
- Backup file config trước khi sửa hàng loạt
- Dùng ảnh kích thước tương đương để tránh méo hình

## Font chữ

Tất cả font được cấu hình tại `WEDDING_CONFIG.fonts` trong `src/config.ts`:

| Trường          | Áp dụng                                                   |
| --------------- | --------------------------------------------------------- |
| `sans`          | Nội dung, nút, biểu mẫu (`font-sans`)                     |
| `serif`         | Tiêu đề, chữ trang trí (`font-serif`)                     |
| `coupleNames`   | Tên cô dâu và chú rể (`font-couple`), mặc định Corinthia  |
| `mono`          | Số liệu, ngày tháng, ô mật khẩu (`font-mono`)             |
| `stylesheetUrl` | URL stylesheet tải font từ Google Fonts hoặc dịch vụ khác |

Khi đổi font, cập nhật tên font trong `sans`/`serif`/`mono` và URL tải font tương ứng. Giữ các font dự phòng sau dấu phẩy để chữ vẫn hiển thị khi không tải được font. Nếu chỉ dùng font có sẵn trên máy, đặt `stylesheetUrl: ''`. Font mới nên hỗ trợ tiếng Việt và các độ đậm/nghiêng đang sử dụng.

Các component giữ class `font-sans`, `font-serif`, `font-mono`; thay config sẽ áp dụng cho toàn bộ giao diện. Build/deploy lại để cập nhật website. Cỡ chữ và độ đậm vẫn được đặt bằng class Tailwind tại từng thành phần.

## Giao diện theo thiệp giấy kem

Bảng màu nằm trong `WEDDING_CONFIG.colors`: `background` là nền kem, `paper` là nền khung thiệp, `soft` là nền phân khu, `ink`/`muted` là màu chữ, `border` là viền. `coupleNames` điều khiển riêng màu tên hai bạn, giữ font Corinthia.

Họa tiết hoa khô được đặt ở `images.stationeryFlowers` (file `public/dried-flowers.svg`), dùng cho đầu trang thiệp mời và chi tiết sự kiện. Hai ảnh hero cũ vẫn lưu trong config để có thể dùng lại; giao diện hiện dùng nền giấy thay cho chúng. Khi thay họa tiết, nên dùng SVG hoặc PNG nền trong suốt. Tông tùy chỉnh cũ được tách khỏi giao diện mới để lần mở đầu hiển thị đúng bảng màu thiệp.

## Bản trải nghiệm thiệp mới

Chạy `npm run dev` và mở địa chỉ Vite hiển thị. Khách bắt đầu ở màn mở thiệp, bấm Mở thiệp mời để vào trang cuộn và bật nhạc. Nút nhạc ở thanh đầu trang; cuối trang có Xem lại lời mời.

Thứ tự trang: thiệp chính → đếm ngược → lịch lễ/bản đồ → ảnh cưới → album → RSVP → lời chúc. Menu chuyển tới từng phần, không đổi sang trang riêng; quản trị vẫn là khu vực riêng. Nội dung màn mở, lời kết và nhãn mới nằm tại `copy.experience`. Màn mở lấy tên khách từ tham số `to` và lịch tương ứng từ `group` như thiệp chính.

Corinthia vẫn dùng cho tên hai bạn. Album dùng ảnh lớn xen kẽ cặp ảnh nhỏ, hỗ trợ mở bằng bàn phím và đóng bằng Escape. Khi thiết bị bật Reduce Motion, hiệu ứng được giảm. RSVP/lời chúc tiếp tục dùng Supabase; bản xem thử giao diện không thay cấu hình backend.

## Bộ giao diện Ivory · Rose Gold

Bản thiết kế hiện tại lấy cảm hứng từ giấy ivory, mực olive và kim loại rose gold. Các giá trị nằm trong `colors`: `primary` là màu nhấn olive, `coupleNames` là màu tên riêng, `accent` là rose gold, `metallicLight`/`metallicDark` điều khiển điểm sáng và cạnh kim loại, `gold` là champagne trang trí.

`images.paperTexture` trỏ tới `public/ivory-paper.svg`, lớp vân giấy nhẹ dùng chung cho nền, thiệp, các khung nội dung và chân trang. Nút có class `metal-button` được tạo bằng CSS: vân kim loại, viền nổi, bóng đổ và ánh sáng lướt khi hover. Hiệu ứng giảm khi thiết bị bật Reduce Motion. Màu tên màn mở thiệp đọc từ config, không đặt inline trong component.

## Tối ưu tải ảnh

Ảnh Cloudinary được xử lý qua `src/imageUtils.ts`: tự chọn định dạng/chất lượng và dùng `srcSet` để trình duyệt tải đúng kích thước màn hình. Giữ URL gốc trong config; không cần thêm tham số thủ công. Album tải ảnh nhỏ phù hợp màn hình, còn lightbox dùng bản tối đa 1920px. Khi mở lightbox, hai ảnh kế bên được tải trước (trừ khi bật Save Data).

`images.monogram` và `images.stationeryFlowers` hiện dùng bản WebP nhẹ từ logo/hoa gốc. Các SVG gốc vẫn giữ trong `public/`. Nếu thay SVG gốc, cần xuất lại WebP tương ứng hoặc đổi đường dẫn config sang file ảnh mới; không chỉ thay SVG rồi giữ đường dẫn WebP cũ.

Trang ưu tiên mở thiệp trước, sau đó tải trước ảnh chân dung và ảnh album đầu khi trình duyệt rảnh. Các ảnh bản đồ/RSVP/album còn lại được tải theo vị trí cuộn. Bộ đếm được tách riêng để không render lại album mỗi giây; trang quản trị chỉ tải JavaScript khi mở. Không cần tải toàn bộ ảnh gốc để hiển thị ảnh thu nhỏ.

## Hộp quà mừng cô dâu/chú rể

Nút Gửi quà mừng nằm ở góc phải cuối Bức tường lời chúc; nhấn để mở nhẹ phần QR và lời cảm ơn. Đặt hai ảnh QR thật vào `public/qr-bride.png` và `public/qr-groom.png`, hoặc thay URL ở `images.qrBride`/`images.qrGroom` trong config. Dùng ảnh rõ nét, nền trắng, giữ đủ viền trắng quanh QR; không qua bộ nén Cloudinary của album.

Thông tin ngân hàng tùy chọn nằm tại `gifts.bride` và `gifts.groom` (`bankName`, `accountName`, `accountNumber`); trường trống sẽ không hiển thị. Lời cảm ơn và nhãn nằm tại `copy.gifts`. Đặt `gifts.enabled: false` để ẩn toàn bộ hộp quà. Khi chưa có ảnh hoặc ảnh lỗi, khung hiển thị Mã QR đang được cập nhật, không tạo QR giả. Ảnh QR chỉ được tải khi khách mở hộp quà.

Hiện hai QR mẫu `public/qr-bride-demo.svg` và `public/qr-groom-demo.svg` chỉ chứa chữ minh họa, không có tài khoản ngân hàng. Khi thay QR thật, đổi `images.qrBride`/`images.qrGroom` sang đường dẫn mới, đồng thời đặt `gifts.bride.demo`/`gifts.groom.demo` thành `false` để bỏ nhãn QR mẫu.
