const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dùng Cloudinary nếu có cấu hình (production)
// Dùng disk nếu không có (local dev)
const useCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME;

let cloudinaryStorage = null;

if (useCloudinary) {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    cloudinaryStorage = new CloudinaryStorage({
        cloudinary,
        params: (req, file) => ({
            folder: 'moviewebsite',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            public_id: `${file.fieldname}-${Date.now()}`,
        }),
    });
}

// Local disk storage (chỉ dùng khi dev)
const resolveUploadDir = () => {
    const backendPublicImages = path.join(__dirname, '..', 'public', 'images');
    if (fs.existsSync(path.join(__dirname, '..', 'public'))) {
        return backendPublicImages;
    }
    return path.join(__dirname, '..', '..', 'public', 'images');
};

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = resolveUploadDir();
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

// Danh sách định dạng ảnh cho phép
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

// fileFilter: chỉ cho phép ảnh
const imageFileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận ảnh định dạng JPG, JPEG, PNG, WEBP hoặc GIF!'), false);
    }
};

const upload = multer({
    storage: useCloudinary ? cloudinaryStorage : diskStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Tối đa 5MB mỗi file
});

/**
 * Lấy URL công khai của file sau khi upload.
 * - Cloudinary: file.path chứa URL đầy đủ (https://res.cloudinary.com/...)
 * - Local disk: trả về đường dẫn tương đối /images/filename
 */
const getFileUrl = (file) => {
    if (useCloudinary) {
        return file.path; // Cloudinary secure URL
    }
    return `/images/${file.filename}`; // Local path
};

module.exports = { upload, getFileUrl };