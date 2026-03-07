require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const https = require('https');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const hpp = require('hpp');

const app = express();
const PORT = process.env.PORT || 8080;

// =============================================================
// 🔒 TẦNG 1: BẢo MẬT HTTP HEADERS (Helmet)
// Tự động gắn các HTTP Header bảo mật, chặn Clickjacking,
// XSS qua header, MIME Sniffing, v.v.
// =============================================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "www.google-analytics.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"], // Chặn Clickjacking
        },
    },
    crossOriginEmbedderPolicy: false, // Tắt để không ảnh hưởng đến ảnh/font bên ngoài
}));

// =============================================================
// 🔒 TẦNG 2: CHỐNG HTTP PARAMETER POLLUTION (hpp)
// Chặn kẻ tấn công gửi nhiều tham số trùng lặp phá hoại logic
// =============================================================
app.use(hpp());

// =============================================================
// 🔒 TẦNG 3: GIỚI HẠN TỐC ĐỘ TOÀN CỤC (Global Rate Limit)
// Mỗi IP chỉ được gọi tối đa 100 request trong 15 phút
// =============================================================
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.'
    },
    skip: (req) => {
        // Bỏ qua rate limit cho các yêu cầu tài nguyên tĩnh (ảnh, css, js)
        const ext = path.extname(req.path).toLowerCase();
        return ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2'].includes(ext);
    }
});
app.use(globalLimiter);

// =============================================================
// 🔒 TẦNG 4: LÀM CHẬM BOT TẤN CÔNG (Slow Down)
// Sau 20 request, mỗi request tiếp theo chậm thêm 500ms
// (Gây chán nản bot DDoS mà không ảnh hưởng người dùng thật)
// =============================================================
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 phút
    delayAfter: 20,
    delayMs: () => 500, // Chậm thêm 500ms cho mỗi request vượt ngưỡng
});
app.use('/api/', speedLimiter);

// =============================================================
// 🔒 TẦNG 5: GIỚI HẠN TỐC ĐỘ API FORM (Nghiêm ngặt hơn)
// Mỗi IP chỉ được gửi form tối đa 5 lần trong 10 phút
// =============================================================
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 phút
    max: 5,
    message: {
        success: false,
        message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ 10 phút rồi thử lại.'
    }
});
app.use('/api/submit-quote', apiLimiter);
app.use('/api/submit-survey', apiLimiter);

// =============================================================
// 🔒 TẦNG 6: WHITELIST CORS
// Chỉ chấp nhận request từ tên miền của chính mình
// =============================================================
const allowedOrigins = [
    'https://tranvachquangninh.indevs.in',
    'https://tranvachquangninh.onrender.com',
    'http://localhost:8080',
    'http://localhost:3000',
];
app.use(cors({
    origin: (origin, callback) => {
        // Cho phép request không có origin (Postman, curl để test)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(new Error('Không được phép truy cập (CORS)'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// =============================================================
// MIDDLEWARE CƠ BẢN
// =============================================================
app.use(compression());

// Giới hạn kích thước body request (chống tấn công gửi payload khổng lồ)
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Phục vụ file tĩnh với cache
app.use(express.static(path.join(__dirname, '.'), {
    maxAge: '1d',
    etag: true
}));

// =============================================================
// 🔒 TẦNG 7: CHẶN USER-AGENT ĐỘC HẠI
// Chặn các bot/scanner công cụ tấn công phổ biến
// =============================================================
const blockedUserAgents = [
    /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
    /python-requests/i, /go-http-client/i, /curl/i,
    /libwww-perl/i, /scrapy/i, /wget/i, /httpclient/i,
    /java\//i, /okhttp/i, /nessus/i, /openvas/i,
];

app.use((req, res, next) => {
    const ua = req.headers['user-agent'] || '';
    if (blockedUserAgents.some(pattern => pattern.test(ua))) {
        console.warn(`Blocked suspicious User-Agent: ${ua} from IP: ${req.ip}`);
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
});

// =============================================================
// 🔒 TẦNG 8: CHẶN CÁC XSS & INJECTION THỦ CÔNG
// Làm sạch input từ người dùng
// =============================================================
const sanitizeInput = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim()
        .substring(0, 500); // Giới hạn độ dài tối đa mỗi field
};

// =============================================================
// HELPER FUNCTIONS
// =============================================================

// Ghi log submission vào file
const logSubmission = (data, ip = 'unknown') => {
    const logFile = path.join(__dirname, 'submissions.log.json');
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, ip, ...data };
    try {
        let logs = [];
        if (fs.existsSync(logFile)) {
            const content = fs.readFileSync(logFile, 'utf-8');
            logs = JSON.parse(content);
        }
        logs.push(logEntry);
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error('Failed to log submission:', error);
    }
};

// Ghi log các IP bị chặn
const logBlockedRequest = (ip, reason) => {
    const timestamp = new Date().toISOString();
    console.warn(`[BLOCKED] ${timestamp} | IP: ${ip} | Reason: ${reason}`);
};

// Gửi Telegram
const sendTelegram = (data) => {
    return new Promise((resolve) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        if (!token || !chatId) { return resolve(false); }

        const message = `
📥 YÊU CẦU BÁO GIÁ MỚI

👤 Họ tên: ${data.name}
📞 SĐT: ${data.phone}
📝 Nội dung:
${data.message || 'Không có mô tả'}

⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
🌐 Nguồn: Website
        `.trim();

        const postData = JSON.stringify({ chat_id: chatId, text: message });
        const options = {
            hostname: 'api.telegram.org', port: 443,
            path: `/bot${token}/sendMessage`, method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
        };
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(res.statusCode >= 200 && res.statusCode < 300));
        });
        req.on('error', () => resolve(false));
        req.write(postData);
        req.end();
    });
};

// Gửi Email
const sendEmail = async (data) => {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;
    if (!user || !pass) { return false; }
    try {
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
        await transporter.sendMail({
            from: user, to: user,
            subject: '[Website] Có yêu cầu báo giá mới',
            text: `Họ tên: ${data.name}\nSố điện thoại: ${data.phone}\nNội dung: ${data.message || 'Không có'}\nThời gian: ${new Date().toLocaleString('vi-VN')}`
        });
        return true;
    } catch (error) { console.error('Email failed:', error); return false; }
};

// =============================================================
// HEALTH CHECK
// =============================================================
app.head('/api/health', (req, res) => res.status(200).send());
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// =============================================================
// API: GỬI YÊU CẦU BÁO GIÁ
// =============================================================
app.post('/api/submit-quote', async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Lấy và làm sạch input
    const name = sanitizeInput(req.body.name);
    const phone = sanitizeInput(req.body.phone);
    const message = sanitizeInput(req.body.message);
    const website = req.body.website; // Honeypot field

    // Kiểm tra honeypot (bẫy bot tự điền form)
    if (website) {
        logBlockedRequest(clientIP, 'Honeypot triggered (quote)');
        return res.status(400).json({ success: false, message: 'Invalid submission' });
    }

    // Validate
    if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    if (phone.replace(/\s/g, '').length < 10) {
        return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ' });
    }

    logSubmission({ type: 'quote', name, phone, message }, clientIP);

    try {
        const [tgResult, emailResult] = await Promise.all([
            sendTelegram({ name, phone, message }),
            sendEmail({ name, phone, message })
        ]);
        console.log(`Quote - Telegram: ${tgResult}, Email: ${emailResult}`);
        res.json({ success: true, message: 'Gửi yêu cầu thành công' });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
});

// =============================================================
// API: ĐẶT LỊCH KHẢO SÁT
// =============================================================
app.post('/api/submit-survey', async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    const name = sanitizeInput(req.body.name);
    const phone = sanitizeInput(req.body.phone);
    const address = sanitizeInput(req.body.address);
    const time = sanitizeInput(req.body.time);
    const area = sanitizeInput(req.body.area);
    const website = req.body.website; // Honeypot

    if (website) {
        logBlockedRequest(clientIP, 'Honeypot triggered (survey)');
        return res.status(400).json({ success: false, message: 'Invalid submission' });
    }

    if (!name || !phone || !address) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    if (phone.replace(/\s/g, '').length < 10) {
        return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ' });
    }

    logSubmission({ type: 'survey', name, phone, address, time, area }, clientIP);

    try {
        const messageText = `📅 Đặt lịch khảo sát:\n${name}\n${phone}\n📍 ${address}\n⏰ ${time || 'Linh hoạt'}\n📐 ${area ? area + 'm²' : 'Chưa rõ'}`;
        const [tgResult, emailResult] = await Promise.all([
            sendTelegram({ name, phone, message: messageText }),
            sendEmail({ name, phone, message: messageText })
        ]);
        console.log(`Survey - Telegram: ${tgResult}, Email: ${emailResult}`);
        res.json({ success: true, message: 'Đặt lịch khảo sát thành công' });
    } catch (err) {
        console.error('Survey error:', err);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
});

// =============================================================
// 🔒 XỬ LÝ LỖI TOÀN CỤC
// Không để lộ thông tin nội bộ server ra ngoài
// =============================================================
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    if (err.message.includes('CORS')) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
});

// Chặn mọi route không tồn tại
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Không tìm thấy trang' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`🔒 Security layers: Helmet, Rate Limit, Slow Down, HPP, XSS Clean, CORS, Bot Blocker`);
});
