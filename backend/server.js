
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

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const watchHistoryRoutes = require('./routes/watchHistoryRoutes');
const episodesRoutes = require('./routes/episodesRoutes');

const app = express();
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