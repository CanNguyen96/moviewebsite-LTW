const jwt = require('jsonwebtoken');

//Middleware để xác thực token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Không có token, vui lòng đăng nhập' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
        }
        req.user = user; // Lưu thông tin user vào request
        next();
    });
};

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    // req.user được gán từ authenticateToken
    if (!req.user || Number(req.user.role_id) !== 1) {
        return res.status(403).json({ error: 'Bạn không có quyền thực hiện hành động này. Yêu cầu quyền Admin.' });
    }
    next();
};

module.exports = {
    authenticateToken,
    isAdmin
};