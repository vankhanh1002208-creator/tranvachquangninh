require('dotenv').config();
const https = require('https');

const sendTelegram = (data) => {
    return new Promise((resolve) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        console.log('Token:', token);
        console.log('ChatId:', chatId);

        const message = "Test message from debugging script";

        const postData = JSON.stringify({ chat_id: chatId, text: message });
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${token}/sendMessage`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
        };
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log('Status:', res.statusCode);
                console.log('Body:', body);
                resolve(res.statusCode >= 200 && res.statusCode < 300);
            });
        });
        req.on('error', (e) => {
            console.log('Req error:', e);
            resolve(false);
        });
        req.write(postData);
        req.end();
    });
};

sendTelegram({}).then(res => console.log('Result:', res));
