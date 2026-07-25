const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const fs = require('fs');
const db = require('../config/db');

async function seed() {
    try {
        console.log('Bắt đầu chèn dữ liệu 10 phim Hoạt hình (Donghua)...');
        const sqlPath = path.resolve(__dirname, '../../database/add_10_donghua.sql');
        
        if (!fs.existsSync(sqlPath)) {
            console.error('Không tìm thấy file SQL tại:', sqlPath);
            process.exit(1);
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('USE'));

        for (const stmt of statements) {
            if (stmt) {
                await db.query(stmt);
            }
        }
        console.log('✅ Đã nạp thành công 10 phim Donghua mới vào Database!');
    } catch (err) {
        console.error('❌ Lỗi khi nạp dữ liệu:', err);
    } finally {
        process.exit();
    }
}

seed();
