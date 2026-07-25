const errorHandler = (err, req, res, next) => {
    // Nếu có mã status được chỉ định thì dùng, ngược lại mặc định là 500 (Lỗi server)
    const statusCode = err.statusCode || 500;
    
    // Ghi nhận log lỗi lên console hệ thống để lập trình viên dễ theo dõi
    console.error(`[ERROR] [${req.method}] ${req.path} - Status: ${statusCode}`);
    if (statusCode === 500) {
        console.error(err.stack || err);
    } else {
        console.error(err.message);
    }

    // Lấy thông điệp lỗi cụ thể
    const message = err.message || 'Đã xảy ra lỗi';

    // Xác định nội dung thông điệp trả về cho client
    // Chỉ trả lỗi chi tiết nếu là lỗi nghiệp vụ (isOperational = true) hoặc đang ở môi trường phát triển (development)
    const isDev = process.env.NODE_ENV === 'development';
    const responseMessage = (err.isOperational || isDev)
        ? message
        : 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.';

    // Trả về response JSON với cả 2 key 'error' và 'message' để tương thích với tất cả các API
    return res.status(statusCode).json({
        error: responseMessage,
        message: responseMessage
    });
};

module.exports = errorHandler;
