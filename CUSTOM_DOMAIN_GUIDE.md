# 🌐 HƯỚNG DẪN GẮN TÊN MIỀN (CUSTOM DOMAIN)

Bạn đã có **Tên Miền**.
Bạn đã có **Code Web**.
Bây giờ chúng ta sẽ kết nối chúng lại.

Chúng ta sẽ sử dụng **Render** làm Hosting vì nó hỗ trợ Node.js miễn phí và cài đặt SSL (ổ khóa xanh HTTPS) tự động.

---

## BƯỚC 1: ĐƯA WEB LÊN RENDER (Nếu chưa làm)
*Làm theo hướng dẫn trong file `DEPLOY.md` tôi đã tạo trước đó.*
1. Đẩy code lên GitHub.
2. Tạo Web Service trên Render.
3. Đảm bảo web chạy được trên link miễn phí của Render trước (ví dụ: `thach-cao-pro.onrender.com`).

---

## BƯỚC 2: THÊM TÊN MIỀN VÀO RENDER
1. Đăng nhập vào [dashboard.render.com](https://dashboard.render.com).
2. Chọn Web Service bạn vừa tạo.
3. Ở menu bên trái, chọn **"Custom Domains"**.
4. Bấm **+ Add Custom Domain**.
5. Nhập tên miền của bạn (ví dụ: `thachcaopro.com`) và bấm **Save**.

---

## BƯỚC 3: CẤU HÌNH DNS (Quan Trọng Nhất)
Bạn cần đăng nhập vào trang quản lý tên miền (nơi bạn mua tên miền: Mắt Bão, Tenten, iNET, GoDaddy...).
Tìm phần **Cấu hình DNS (DNS Management)** và thêm 2 bản ghi sau:

| Loại (Type) | Tên (Host/Name) | Giá trị (Value/Target) |
|-------------|-----------------|------------------------|
| **CNAME**   | `www`           | `thach-cao-pro.onrender.com` (Thay bằng link Render của bạn) |
| **A**       | `@`             | `216.24.57.1` (IP của Render) |

*(Lưu ý: Render sẽ hiện thông số chính xác trong mục Custom Domains sau khi bạn Add Domain. Hãy copy chính xác từ đó).*

---

## BƯỚC 4: CHỜ ĐỢI & HTTPS
1. Sau khi thêm DNS, cần chờ từ **30 phút - 24 tiếng** để mạng toàn cầu cập nhật.
2. Render sẽ **tự động** cài chứng chỉ bảo mật SSL (HTTPS) cho bạn.
3. Khi hoàn tất, truy cập `https://thachcaopro.com` sẽ thấy web hoạt động và có biểu tượng ổ khóa an toàn.

---

## 💡 CÂU HỎI THƯỜNG GẶP

**Q: Tại sao không dùng Hosting PHP (cPanel) thông thường?**
A: Web này dùng Node.js để chạy tự động và gửi thông báo. Hosting thường không chạy được lệnh `node server.js` hoặc cấu hình rất phức tạp. Render là giải pháp chuyên dụng cho Node.js.

**Q: Tôi có mất phí duy trì không?**
A: 
- **Tên miền**: Đóng phí hàng năm cho nhà cung cấp tên miền.
- **Hosting (Render)**: Miễn phí (Gói Free). Tuy nhiên gói Free sẽ "ngủ" nếu 15p không ai vào. Để chuyên nghiệp, bạn nên nâng cấp gói Starter trên Render ($7/tháng) để web chạy 24/7 siêu mượt.

**Q: Gói Free của Render có bị chậm không?**
A: Chỉ chậm 50 giây đầu tiên khi truy cập lại sau một thời gian dài. 
*Mẹo:* Dùng công cụ [UptimeRobot](https://uptimerobot.com) (miễn phí) để ping web 5 phút/lần, web sẽ không bao giờ ngủ -> Chạy nhanh như gói trả phí!
