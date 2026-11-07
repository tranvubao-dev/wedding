# Kết nối Supabase

Source đã tích hợp Supabase, nhưng bạn cần tạo dự án và cấu hình các bước bên dưới. Không cần chuyển website khỏi GitHub Pages.

## 1. Tạo dự án

Đăng nhập https://supabase.com/dashboard và tạo New project. Lưu mật khẩu database riêng. Chờ dự án khởi tạo xong.

## 2. Tạo bảng và phân quyền

Mở SQL Editor → New query. Sao chép toàn bộ `supabase/schema.sql` trong source, dán vào và nhấn Run.

SQL tạo bảng `wedding_guests`, bảng tài khoản quản trị và các hàm đọc/gửi dữ liệu. Khách không thể đọc RSVP hoặc xóa/sửa dữ liệu. Bức tường công khai chỉ nhận id, tên, lời chúc và ngày gửi.

## 3. Tạo tài khoản quản trị

Trong Authentication → Users, dùng Add user → Create new user, nhập email và mật khẩu của bạn. Xác nhận email tài khoản (Auto Confirm nếu dashboard có tùy chọn).

Sao chép User UID của tài khoản vừa tạo. Mở SQL Editor và chạy câu dưới đây, thay UUID bằng UID thực tế:

```sql
insert into public.wedding_admins(user_id)
values ('THAY_BANG_USER_UID')
on conflict do nothing;
```

Chỉ thêm UID của người được phép quản trị. Tài khoản đăng ký thông thường không tự có quyền admin. Có thể tắt Allow new users to sign up trong Authentication vì website không cần đăng ký công khai.

## 4. Lấy thông tin kết nối

Trong hộp Connect hoặc Settings → API Keys, lấy Project URL và publishable key (`sb_publishable_...`). Khóa `anon` legacy cũng được SDK hỗ trợ. Không sử dụng secret key hoặc `service_role` trong website.

### Chạy tại máy

Tạo `.env.local` ở thư mục gốc dự án, dựa trên `.env.example`:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Chạy `npm ci`, sau đó `npm run dev`. Nếu đang chạy dev thì tắt và mở lại sau khi sửa `.env.local`.

### Chạy trên GitHub Pages

Mở repository → Settings → Secrets and variables → Actions:

1. Tab Variables → New repository variable: tên `VITE_SUPABASE_URL`, giá trị là Project URL.
2. Tab Secrets → New repository secret: tên `VITE_SUPABASE_PUBLISHABLE_KEY`, giá trị là publishable key.
3. Push source lên `main` hoặc chạy lại workflow Deploy Wedding Vite Site.

Hai giá trị này được đưa vào website lúc build, không phải lúc mở trang. Khi đổi cấu hình phải chạy build/deploy lại. Publishable key là khóa được phép xuất hiện trong trình duyệt; quyền bảo vệ dữ liệu nằm ở SQL/RLS.

## 5. Kiểm tra sau khi deploy

- Mở website, gửi một RSVP và lời chúc. Thông báo thành công chỉ xuất hiện sau khi Supabase đã nhận dữ liệu.
- Mở trình duyệt khác: lời chúc xuất hiện sau khi tải lại hoặc tối đa khoảng 30 giây.
- Bấm biểu tượng người dùng ở góc phải, đăng nhập email/mật khẩu đã tạo. Mở Quản Lý Khách để xem phản hồi.
- Đăng xuất: danh sách RSVP không còn được tải về cho khách.
- Thử tài khoản không nằm trong `wedding_admins`: không được vào quản trị.

## Cách lưu dữ liệu

Mỗi lần gửi tạo một bản ghi độc lập. Website không ghép theo tên vì nhiều khách có thể trùng tên và người lạ không được ghi đè phản hồi của người khác. Thiệp tạo sẵn, RSVP và lời chúc riêng có thể tạo nhiều dòng cùng tên; admin cần kiểm tra các dòng khi tổng hợp số khách. Việc chỉnh sửa RSVP qua link riêng chưa được triển khai.

Tên và nội dung lời chúc được công khai ngay, có thông báo tại biểu mẫu. Admin có thể xóa bản ghi không phù hợp. Dữ liệu khách/lời chúc mẫu và dữ liệu localStorage cũ không được tự tải lên Supabase. Màu giao diện và lượt thích vẫn chỉ lưu cục bộ; không phải thống kê lượt thích chung.

Danh sách admin tải tối đa 1000 dòng mới nhất; bức tường tải tối đa 200 lời chúc mới nhất. Kết nối được làm mới mỗi 30 giây, không dùng Realtime subscriptions.

Endpoint gửi phản hồi là công khai để khách không cần tài khoản. SQL giới hạn độ dài và số người (tối đa 20), nhưng chưa có CAPTCHA hoặc giới hạn tốc độ theo IP. Có thể bổ sung Edge Function/CAPTCHA nếu cần chống spam.

Nếu website báo chưa kết nối, kiểm tra hai biến môi trường và deploy lại. Nếu gửi lỗi, kiểm tra đã chạy SQL và dự án Supabase đang hoạt động. Không có chế độ giả báo thành công bằng localStorage khi backend bị lỗi.
