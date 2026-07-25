const AppError = require('./AppError');

class NotFoundError extends AppError {
    constructor(message = 'Không tìm thấy tài nguyên yêu cầu') {
        super(message, 404);
    }
}

module.exports = NotFoundError;
