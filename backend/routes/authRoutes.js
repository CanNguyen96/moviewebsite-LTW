const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth'); 

router.post('/register', authController.register); // API Đăng kí người dùng
router.post('/login', authController.login); // API Đăng nhập người dùng
router.put('/api/user', authenticateToken, authController.updateUser); // API Cập nhật người dùng
router.put('/forgot-password', authController.forgotPassword); // API Quên mật khẩu

module.exports = router;