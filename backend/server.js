
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Kiểm tra biến môi trường bắt buộc khi khởi động
const REQUIRED_ENV = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
    console.error(`FATAL: Thiếu biến môi trường bắt buộc: ${missingEnv.join(', ')}`);
    process.exit(1);
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const watchHistoryRoutes = require('./routes/watchHistoryRoutes');
const episodesRoutes = require('./routes/episodesRoutes');

const app = express();

// Sử dụng Helmet để thiết lập các HTTP headers bảo mật
// CORP được cấu hình là cross-origin để frontend có thể tải ảnh/video từ backend
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Cấu hình giới hạn tần suất yêu cầu (Rate Limiting)
const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 phút
    max: 3, // Giới hạn 3 lần gửi OTP
    message: { error: 'Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau 5 phút.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 phút
    max: 10, // Giới hạn 10 lần thử đăng nhập/đăng ký
    message: { error: 'Thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau 5 phút.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Áp dụng giới hạn cho các endpoint cụ thể
app.use('/send-register-otp', otpLimiter);
app.use('/send-forgot-otp', otpLimiter);
app.use('/login', authLimiter);
app.use('/register', authLimiter);
app.use('/forgot-password', authLimiter);
app.use('/google', authLimiter);

const port = process.env.PORT || 3001;
const fs = require('fs');
const publicDir = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')        // Docker: /app/public (mount từ compose)
  : path.join(__dirname, '..', 'public'); // Local: projectRoot/public

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use('/images', express.static(path.join(publicDir, 'images')));
app.use('/videos', express.static(path.join(publicDir, 'videos')));

// Routes
app.use('/', authRoutes); 
app.use('/', movieRoutes);
app.use('/', reviewRoutes);
app.use('/', userRoutes);
app.use('/', categoryRoutes);
app.use('/', favoritesRoutes);
app.use('/', watchHistoryRoutes);
app.use('/', episodesRoutes);

// Khởi động server
app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});