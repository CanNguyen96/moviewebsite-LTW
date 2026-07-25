const AppError = require('./AppError');

class ForbiddenError extends AppError {
    constructor(message = 'Bạn không có quyền thực hiện hành động này') {
        super(message, 403);
    }
}

module.exports = ForbiddenError;
