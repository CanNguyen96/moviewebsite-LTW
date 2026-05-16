
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
console.log('DB_HOST:', process.env.DB_HOST);

const mysql = require('mysql2');

// TiDB Cloud (production) yêu cầu SSL
// Local MySQL không cần SSL
const sslConfig = process.env.DB_SSL === 'true'
    ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
    : {};

// Dùng pool thay vì single connection — tự động reconnect khi bị ngắt
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'web',
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    ...sslConfig,
});

// Kiểm tra kết nối lúc khởi động
db.getConnection((err, connection) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err.message);
        console.error('Chi tiết:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
    } else {
        console.log('Đã kết nối MySQL thành công!');
        connection.release();
    }
});

module.exports = db;