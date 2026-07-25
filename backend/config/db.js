const mysql = require('mysql2');

// TiDB Cloud (production) yêu cầu SSL
// Local MySQL không cần SSL
const sslConfig = process.env.DB_SSL === 'true'
    ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
    : {};

// Dùng pool kết nối dạng promise
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'web',
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    ...sslConfig,
});

const db = pool.promise();

// Kiểm tra kết nối lúc khởi động
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Đã kết nối MySQL thành công!');
        connection.release();
    } catch (err) {
        console.error('Lỗi kết nối MySQL:', err.message);
        console.error('Chi tiết:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
    }
})();

module.exports = db;
