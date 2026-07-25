const AppError = require('./AppError');

class BadRequestError extends AppError {
    constructor(message = 'Yêu cầu không hợp lệ') {
        super(message, 400);
    }
}

module.exports = BadRequestError;
