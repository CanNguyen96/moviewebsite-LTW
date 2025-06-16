const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = '/app/public/images'; // Đường dẫn trong container
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
        }
        cb(null, uploadDir); // Nơi lưu ảnh
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${Date.now()}${ext}`; // Tạo tên file
        cb(null, filename);
    }
});

const upload = multer({ storage });

module.exports = upload;