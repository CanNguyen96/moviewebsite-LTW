const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth'); 
const upload = require('../middlewares/upload'); // Thêm multer

router.post('/send-register-otp', authController.sendRegisterOtp); // API Gửi OTP Đăng ký
router.post('/register', authController.register); // API Đăng kí người dùng
router.post('/login', authController.login); // API Đăng nhập người dùng
router.post('/google', authController.googleLogin); // API Đăng nhập bằng Google
router.put('/api/user', authenticateToken, upload.single('avatar'), authController.updateUser); // API Cập nhật người dùng
router.post('/send-forgot-otp', authController.sendForgotOtp); // API Gửi OTP Quên mật khẩu
router.put('/forgot-password', authController.forgotPassword); // API Quên mật khẩu

module.exports = router;