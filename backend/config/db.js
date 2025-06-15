
require('dotenv').config();
console.log('DB_HOST:', process.env.DB_HOST);

const mysql = require('mysql2');

// Kết nối MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'db' ,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'web',
    port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
    if (err) {
        console.error(' Lỗi kết nối MySQL:', err.message);
        console.error('Chi tiết:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
});
    } else {
        console.log(' Đã kết nối MySQL!');
    }
});

module.exports = db;