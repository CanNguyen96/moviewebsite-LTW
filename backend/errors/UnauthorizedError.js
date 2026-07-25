const AppError = require('./AppError');

class UnauthorizedError extends AppError {
    constructor(message = 'Chưa đăng nhập hoặc thông tin xác thực không đúng') {
        super(message, 401);
    }
}

module.exports = UnauthorizedError;
