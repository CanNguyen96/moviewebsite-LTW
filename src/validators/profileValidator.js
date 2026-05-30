const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 50;

// Cho phép chữ cái (bao gồm tiếng Việt), số, khoảng trắng, gạch dưới
const USERNAME_REGEX = /^[\w\s\u00C0-\u024F\u1E00-\u1EFF]+$/u;

/**
 * Kiểm tra tên người dùng hợp lệ.
 */
export const validateUserName = (userName) => {
    if (!userName || !userName.trim()) {
        return 'Tên người dùng không được để trống!';
    }
    const trimmed = userName.trim();
    if (trimmed.length < MIN_USERNAME_LENGTH || trimmed.length > MAX_USERNAME_LENGTH) {
        return `Tên người dùng phải từ ${MIN_USERNAME_LENGTH} đến ${MAX_USERNAME_LENGTH} ký tự!`;
    }
    if (!USERNAME_REGEX.test(trimmed)) {
        return 'Tên người dùng chỉ được chứa chữ cái, số, khoảng trắng hoặc dấu gạch dưới!';
    }
    return null;
};
