# 🚀 HƯỚNG DẪN PUBLIC WEBSITE (DEPLOY)

Website của bạn bao gồm 2 phần:
1. **Frontend**: HTML, CSS, JS (Giao diện)
2. **Backend**: Node.js Server (Xử lý Form, Gửi Email/Telegram, Chống Spam)

Do đó, bạn cần một nơi host hỗ trợ **Node.js**.

---

## ✅ CÁCH TỐT NHẤT: DÙNG RENDER.COM (Miễn Phí)

Render có gói Free hỗ trợ Node.js rất tốt.

### Bước 1: Đẩy code lên GitHub
Nếu bạn chưa có Git, hãy cài đặt Git và tạo tài khoản GitHub.
Sau đó chạy các lệnh sau trong terminal (tại thư mục dự án):

```bash
git init
git add .
git commit -m "First commit - Website thach cao completion"
# Tạo repo mới trên github.com rồi chạy lệnh bên dưới (thay URL bằng repo của bạn)
# git remote add origin https://github.com/USERNAME/REPO_NAME.git
# git push -u origin main
```

### Bước 2: Tạo Web Service trên Render
1. Truy cập [dashboard.render.com](https://dashboard.render.com) và đăng nhập bằng GitHub.
2. Nhấn **New +** -> chọn **Web Service**.
3. Chọn Repository bạn vừa đẩy lên ở Bước 1.
4. Điền thông tin:
   - **Name**: `thach-cao-pro` (hoặc tên tùy thích)
   - **Region**: Singapore (cho nhanh ở VN)
   - **Branch**: `main`
   - **Root Directory**: (để trống)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

### Bước 3: Cấu hình Environment Variables (Quan Trọng)
Kéo xuống phần **Environment Variables**, bấm **Add Environment Variable** và thêm tất cả dòng từ file `.env` của bạn vào:

| Key | Value (Lấy từ file .env của bạn) |
|-----|-----------------------------------|
| `TELEGRAM_BOT_TOKEN` | `...` |
| `TELEGRAM_CHAT_ID` | `...` |
| `GMAIL_USER` | `...` |
| `GMAIL_PASS` | `...` |
| `PORT` | `8080` |

### Bước 4: Deploy
Bấm **Create Web Service**.
Render sẽ bắt đầu cài đặt và chạy server. Quá trình mất khoảng 2-3 phút.

Khi hoàn tất, bạn sẽ nhận được đường link dạng: `https://thach-cao-pro.onrender.com`.
Đó chính là website public của bạn! 🎉

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Khởi động chậm (Cold Start)**: Với gói Free của Render, nếu không có ai truy cập trong 15 phút, server sẽ "ngủ". Người tiếp theo truy cập sẽ phải đợi khoảng 50s để server tỉnh dậy.
   - *Cách khắc phục*: Dùng [UptimeRobot](https://uptimerobot.com) (miễn phí) ping website của bạn mỗi 5 phút để giữ nó luôn chạy.

2. **Dữ liệu Log**: File `submissions.log.json` sẽ bị reset mỗi lần bạn deploy lại code (do hệ thống file tạm thời). Nếu muốn lưu dữ liệu lâu dài, nên cân nhắc dùng Database (như MongoDB Atlas - miễn phí) sau này.

---

## 🎉 CHÚC MỪNG
Website của bạn đã sẵn sàng tiếp cận khách hàng thật!
