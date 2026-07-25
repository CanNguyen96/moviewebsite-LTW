const express = require('express');
const assert = require('assert');
const errorHandler = require('../middlewares/errorHandler');
const AppError = require('../errors/AppError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// Định cấu hình kiểm thử độc lập không tác động Database
async function runTests() {
    console.log("=== BẮT ĐẦU CHẠY UNIT TEST HỆ THỐNG LỖI ===");

    // 1. Kiểm tra cấu trúc các Class Custom Error
    try {
        console.log("\n[Test 1] Kiểm tra các Class Custom Error...");
        
        const badReq = new BadRequestError('Dữ liệu sai');
        assert.strictEqual(badReq.statusCode, 400);
        assert.strictEqual(badReq.message, 'Dữ liệu sai');
        assert.strictEqual(badReq.isOperational, true);
        console.log("✓ BadRequestError hoạt động đúng.");

        const notFound = new NotFoundError('Không tìm thấy phim');
        assert.strictEqual(notFound.statusCode, 404);
        assert.strictEqual(notFound.message, 'Không tìm thấy phim');
        assert.strictEqual(notFound.isOperational, true);
        console.log("✓ NotFoundError hoạt động đúng.");

        const forbidden = new ForbiddenError();
        assert.strictEqual(forbidden.statusCode, 403);
        assert.strictEqual(forbidden.isOperational, true);
        console.log("✓ ForbiddenError hoạt động đúng.");
        
    } catch (err) {
        console.error("✗ Thất bại ở Test 1:", err.message);
        process.exit(1);
    }

    // 2. Khởi tạo một Express Server ảo để test Middleware errorHandler
    const app = express();
    app.use(express.json());

    // Các routes giả lập ném lỗi
    app.get('/test-400', (req, res, next) => {
        next(new BadRequestError('Lỗi 400 giả lập'));
    });

    app.get('/test-404', (req, res, next) => {
        next(new NotFoundError('Lỗi 404 giả lập'));
    });

    app.get('/test-500', (req, res, next) => {
        next(new Error('Lỗi database giả lập (500)'));
    });

    // Sử dụng middleware errorHandler
    app.use(errorHandler);

    // Mở port ảo tạm thời
    const PORT = 9999;
    const server = app.listen(PORT, async () => {
        console.log(`\nServer test ảo đang chạy tại port ${PORT}...`);

        try {
            console.log("\n[Test 2] Kiểm tra Middleware errorHandler...");

            // Test Lỗi 400
            const res400 = await fetch(`http://localhost:${PORT}/test-400`);
            const body400 = await res400.json();
            assert.strictEqual(res400.status, 400);
            assert.strictEqual(body400.error, 'Lỗi 400 giả lập');
            assert.strictEqual(body400.message, 'Lỗi 400 giả lập');
            console.log("✓ Middleware xử lý và phản hồi lỗi 400 thành công.");

            // Test Lỗi 404
            const res404 = await fetch(`http://localhost:${PORT}/test-404`);
            const body404 = await res404.json();
            assert.strictEqual(res404.status, 404);
            assert.strictEqual(body404.error, 'Lỗi 404 giả lập');
            console.log("✓ Middleware xử lý và phản hồi lỗi 404 thành công.");

            // Test Lỗi 500
            const res500 = await fetch(`http://localhost:${PORT}/test-500`);
            const body500 = await res500.json();
            assert.strictEqual(res500.status, 500);
            // Ẩn lỗi SQL/hệ thống nhạy cảm ở môi trường production/test ảo
            if (process.env.NODE_ENV === 'development') {
                assert.strictEqual(body500.error, 'Lỗi database giả lập (500)');
            } else {
                assert.strictEqual(body500.error, 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.');
            }
            console.log("✓ Middleware xử lý bảo mật lỗi 500 thành công.");

            console.log("\n=== TẤT CẢ UNIT TESTS ĐÃ ĐẠT (PASSED) ===");
        } catch (error) {
            console.error("\n✗ Thất bại ở Test 2:", error);
        } finally {
            server.close(() => {
                console.log("\nServer test ảo đã đóng. Kết thúc.");
            });
        }
    });
}

runTests();
