# Landing Page Thi Công Trần & Vách Thạch Cao

Landing page chuyển đổi cao cho doanh nghiệp thi công trần thạch cao chuyên nghiệp.

## ✨ Tính Năng Chính

### 🎯 Conversion Optimization
- **Mobile-First Design**: Tối ưu cho điện thoại (60%+ traffic từ mobile)
- **Multiple CTAs**: Nút "Gọi ngay" và "Báo giá" xuất hiện nhiều vị trí chiến lược
- **Sticky Bottom Bar**: Thanh điều hướng cố định trên mobile
- **Zalo Integration**: Nút Zalo nổi (desktop) + trong bottom bar (mobile)
- **Scroll to Top**: Nút cuộn lên đầu trang

### 🔒 Spam Protection & Security
- **Honeypot Field**: Chống bot spam (frontend + backend)
- **Rate Limiting**: Giới hạn 3 yêu cầu/phút/IP
- **Phone Validation**: Kiểm tra định dạng SĐT Việt Nam
- **Input Sanitization**: Validate dữ liệu cả client & server

### 📬 Notification System
- **Dual Channel Notifications**:
  - Telegram Bot (realtime)
  - Gmail (backup)
- **Submission Logging**: Lưu tất cả form submissions vào `submissions.log.json`
- **Error Handling**: Graceful fallback nếu một kênh lỗi

### 🎨 UX Features
- **Testimonials Section**: Đánh giá 5 sao từ khách hàng
- **Timeline Process**: Quy trình 4 bước trực quan
- **Image Lightbox**: Xem ảnh dự án phóng to
- **FAQ Accordion**: Câu hỏi thường gặp có thể đóng/mở
- **Smooth Scrolling**: Cuộn mượt mà với offset header

### 📊 SEO & Performance
- Meta tags đầy đủ (title, description, keywords, OG tags)
- Canonical URL
- Semantic HTML5
- Heading hierarchy chuẩn
- Fast loading với minimal dependencies

## 📁 Cấu Trúc Dự Án

```
webthicong/
├── index.html              # Landing page chính
├── css/
│   └── styles.css         # Toàn bộ styles (Vanilla CSS)
├── js/
│   └── script.js          # Client-side logic
├── assets/
│   └── images/            # Hình ảnh dự án
├── server.js              # Node.js Express backend
├── .env                   # Cấu hình môi trường (KHÔNG commit)
├── package.json           # Dependencies
└── submissions.log.json   # Log form submissions (auto-generated)
```

## 🚀 Cài Đặt & Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình file `.env`

Tạo file `.env` trong thư mục gốc với nội dung:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password-here
PORT=8080
```

**Lưu ý:**
- **GMAIL_PASS**: Phải là App Password (không phải mật khẩu thường)
  - Bật 2FA cho Google Account
  - Vào: https://myaccount.google.com/apppasswords
  - Tạo App Password cho ứng dụng
- **TELEGRAM_BOT_TOKEN**: Lấy từ @BotFather trên Telegram
- **TELEGRAM_CHAT_ID**: ID nhóm hoặc cá nhân nhận thông báo

### 3. Chạy server
```bash
node server.js
```

Server sẽ chạy tại: `http://localhost:8080`

## 📱 Customization

### Thay đổi số điện thoại
Tìm và thay `0912345678` trong các file:
- `index.html` (header, hero, footer, mobile bar)
- Update link Zalo: `https://zalo.me/0912345678`

### Thay đổi màu sắc
Chỉnh sửa CSS variables trong `css/styles.css`:
```css
:root {
    --primary: #0F172A;    /* Màu chủ đạo */
    --accent: #F97316;     /* Màu CTA */
    --success: #22C55E;    /* Màu xanh lá */
}
```

### Thêm/Sửa hình ảnh
- Upload ảnh vào `assets/images/`
- Update đường dẫn `src` trong HTML

## 🎯 Conversion Best Practices Đã Áp Dụng

1. ✅ **Trust Signals**:
   - Số năm kinh nghiệm: 10+ năm
   - Số công trình: 500+
   - Đánh giá 5 sao từ khách thực
   - Cam kết bảo hành 5 năm

2. ✅ **Clear Value Proposition**:
   - "Bền Đẹp – Giá Tốt – Đúng Tiến Độ"
   - Không phát sinh chi phí
   - Phản hồi trong 5-10 phút

3. ✅ **Minimal Friction**:
   - Form chỉ 3 trường (2 bắt buộc)
   - Click-to-call trên mobile
   - Multiple contact options (Phone, Zalo, Form)

4. ✅ **Mobile Optimization**:
   - Touch targets ≥ 48x48px
   - Font size ≥ 16px (tránh zoom trên iOS)
   - Sticky CTAs luôn visible

## 📈 Analytics & Tracking (Tương Lai)

Để theo dõi hiệu quả, nên thêm:
- Google Analytics 4
- Facebook Pixel
- Google Tag Manager
- Conversion tracking cho form submissions

## 🔐 Bảo Mật

- ✅ API keys/tokens không lộ ra client
- ✅ Rate limiting chống spam
- ✅ Honeypot chống bot
- ✅ Input validation cả client-side và server-side
- ✅ CORS enabled với cấu hình an toàn

## 📦 Triển Khai Production

### Khuyến nghị hosting:
- **Frontend**: Vercel / Netlify (miễn phí, SSL tự động)
- **Backend**: Railway / Render / Heroku
- Hoặc VPS: DigitalOcean, Vultr (có kiểm soát hơn)

### Checklist trước khi deploy:
- [ ] Update số điện thoại thật
- [ ] Update địa chỉ thật trong footer
- [ ] Thêm Google Analytics
- [ ] Test Telegram & Email notifications
- [ ] Thêm favicon
- [ ] Optimize images (compression)
- [ ] Update canonical URL
- [ ] Test trên mobile thật

## 🆘 Troubleshooting

**Form không gửi được:**
- Kiểm tra file `.env` đã cấu hình đúng chưa
- Check server console có log lỗi không
- Verify Telegram bot token và chat ID
- Kiểm tra Gmail App Password

**Không nhận được Telegram:**
- Bot chưa được add vào group
- Chat ID sai (dùng @userinfobot để lấy)
- Token không hợp lệ

**Không nhận email:**
- Chưa bật 2FA cho Gmail
- App Password sai
- Gmail block "less secure apps" (phải dùng App Password)

## 📞 Support

Nếu cần hỗ trợ kỹ thuật, vui lòng liên hệ developer.

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-30
