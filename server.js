require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
// Using dynamic import for node-fetch is not needed since I didn't install it, I'll use built-in fetch if node 18+ or install axios. 
// Actually, standard modern node has fetch. I'll use that.
// If fetch is not available (older node), I might need axios. The user's metadata doesn't specify node version but likely recent.
// Safest bet is to use https module or install axios/node-fetch. I see I forgot to install axios/node-fetch in the previous step.
// I will use 'https' module for Telegram to avoid another install if possible, or just re-run install.
// Re-running install is safer for clean code.
// Actually, I'll use the 'https' module since it's zero-dependency for a simple POST request.

const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Rate limiting - simple in-memory store
// NOTE: use a single tracker for all form endpoints.
const submissionTracker = new Map(); // IP -> array of timestamps
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS = 3; // Max 3 submissions per minute per IP

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files

// Health check endpoint for autonomous agent
app.head('/api/health', (req, res) => {
    res.status(200).send();
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});


// Helper: Log submission to file
const logSubmission = (data, ip = 'unknown') => {
    const logFile = path.join(__dirname, 'submissions.log.json');
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        ip,
        ...data
    };

    try {
        let logs = [];
        if (fs.existsSync(logFile)) {
            const content = fs.readFileSync(logFile, 'utf-8');
            logs = JSON.parse(content);
        }
        logs.push(logEntry);
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
        console.log('Submission logged successfully');
    } catch (error) {
        console.error('Failed to log submission:', error);
    }
};

// Helper: Check rate limit
const checkRateLimit = (ip) => {
    const now = Date.now();
    const userSubmissions = submissionTracker.get(ip) || [];

    // Filter out old submissions outside the window
    const recentSubmissions = userSubmissions.filter(time => now - time < RATE_LIMIT_WINDOW);

    if (recentSubmissions.length >= MAX_SUBMISSIONS) {
        return false; // Rate limit exceeded
    }

    recentSubmissions.push(now);
    submissionTracker.set(ip, recentSubmissions);
    return true;
};

// Helper: Send Telegram Message
const sendTelegram = (data) => {
    return new Promise((resolve, reject) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            console.error('Telegram config missing');
            return resolve(false); // Resolve false to not block but log error
        }

        const message = `
📥 YÊU CẦU BÁO GIÁ MỚI

👤 Họ tên: ${data.name}
📞 SĐT: ${data.phone}
📝 Nội dung:
${data.message || 'Không có mô tả'}

⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
🌐 Nguồn: Website
        `.trim();

        const postData = JSON.stringify({
            chat_id: chatId,
            text: message
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${token}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('Telegram sent success');
                    resolve(true);
                } else {
                    console.error('Telegram failed:', body);
                    resolve(false); // Resolve false to indicate failure but allow flow to continue
                }
            });
        });

        req.on('error', (e) => {
            console.error('Telegram request error:', e);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
};

// Helper: Send Email via Gmail
const sendEmail = async (data) => {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS; // App Password

    if (!user || !pass) {
        console.error('Gmail config missing');
        return false;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    const mailOptions = {
        from: user,
        to: user, // Send to self
        subject: '[Website] Có yêu cầu báo giá mới',
        text: `
        Họ tên: ${data.name}
        Số điện thoại: ${data.phone}
        Nội dung yêu cầu: ${data.message || 'Không có mô tả'}
        Thời gian gửi: ${new Date().toLocaleString('vi-VN')}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent success');
        return true;
    } catch (error) {
        console.error('Email failed:', error);
        return false;
    }
};

// API Route
app.post('/api/submit-quote', async (req, res) => {
    const { name, phone, message, website } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Honeypot check (backend validation)
    if (website) {
        console.warn(`Spam attempt from IP: ${clientIP}`);
        return res.status(400).json({ success: false, message: 'Invalid submission' });
    }

    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
        console.warn(`Rate limit exceeded for IP: ${clientIP}`);
        return res.status(429).json({ success: false, message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một chút.' });
    }

    // Server-side validation
    if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    if (!phoneRegex.test(phone)) {
        if (phone.length < 10) {
            return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ' });
        }
    }

    // Log submission for backup
    logSubmission({ name, phone, message }, clientIP);

    try {
        const [tgResult, emailResult] = await Promise.all([
            sendTelegram({ name, phone, message }),
            sendEmail({ name, phone, message })
        ]);

        console.log(`Notification status - Telegram: ${tgResult}, Email: ${emailResult}`);

        res.json({ success: true, message: 'Gửi yêu cầu thành công' });

    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
});

// Survey Booking API Endpoint
app.post('/api/submit-survey', async (req, res) => {
    const { name, phone, address, time, area, website } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    // Honeypot (match hidden field in HTML)
    if (website) {
        console.warn(`Spam attempt (survey) from IP: ${clientIp}`);
        return res.status(400).json({ success: false, message: 'Invalid submission' });
    }

    // Validation
    if (!name || !phone || !address) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ' });
    }

    // Rate limiting (shared)
    if (!checkRateLimit(clientIp)) {
        console.warn(`Rate limit exceeded (survey) for IP: ${clientIp}`);
        return res.status(429).json({ success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' });
    }

    // Log submission
    const submissionData = {
        type: 'survey',
        name,
        phone,
        address,
        time,
        area
    };

    logSubmission(submissionData, clientIp);

    // Send notifications
    try {
        const message = `📅 Đặt lịch khảo sát:\n${name}\n${phone}\n📍 ${address}\n⏰ ${time || 'Linh hoạt'}\n📐 ${area ? area + 'm²' : 'Chưa rõ'}`;

        const [tgResult, emailResult] = await Promise.all([
            sendTelegram({ name, phone, message }),
            sendEmail({ name, phone, message })
        ]);

        console.log(`Survey booking - Telegram: ${tgResult}, Email: ${emailResult}`);
        res.json({ success: true, message: 'Đặt lịch khảo sát thành công' });

    } catch (err) {
        console.error('Survey booking error:', err);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
