const multer = require('multer');
const path = require('path');
const fs = require('fs');

const resolveUploadDir = () => {
    // Docker image mounts app at /app
    const dockerDir = '/app/public/images';
    // On Windows, a path like '/app' may resolve to something like 'C:\\app'
    // and cause files to be written outside the project folder.
    if (process.platform !== 'win32' && (fs.existsSync('/app') || fs.existsSync(dockerDir))) {
        return dockerDir;
    }

    // Local dev: keep consistent with backend/server.js publicDir logic
    // Prefer backend/public/images if backend/public exists (common in this repo)
    const backendPublicImages = path.join(__dirname, '..', 'public', 'images');
    if (fs.existsSync(path.join(__dirname, '..', 'public'))) {
        return backendPublicImages;
    }

    // Fallback: projectRoot/public/images
    return path.join(__dirname, '..', '..', 'public', 'images');
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = resolveUploadDir();
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