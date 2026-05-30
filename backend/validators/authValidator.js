/**
 * Kiểm tra độ mạnh mật khẩu.
 */
const validatePassword = (password) => {
    if (!password || password.length < 6)
        return 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!/\d/.test(password))
        return 'Mật khẩu phải chứa ít nhất 1 chữ số (0-9)';
    if (!/[!@#$%^&*()\[\]{}|<>?~=_+\-]/.test(password))
        return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
    return null;
};

/**
 * Kiểm tra các field bắt buộc không được rỗng.
 */
const validateRequiredFields = (fields) => {
    for (const [name, value] of Object.entries(fields)) {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return { valid: false, message: `Trường "${name}" không được để trống.` };
        }
    }
    return { valid: true, message: null };
};

/**
 * Kiểm tra OTP: tồn tại, đúng type, còn hạn, và đúng giá trị.
 */
const validateOtp = (storedOtpData, otp, type) => {
    if (!storedOtpData || storedOtpData.type !== type) {
        return { valid: false, message: 'Không tìm thấy mã OTP cho email này' };
    }
    if (Date.now() > storedOtpData.expiresAt) {
        return { valid: false, message: 'Mã OTP đã hết hạn, vui lòng gửi lại', expired: true };
    }
    if (storedOtpData.otp !== otp) {
        return { valid: false, message: 'Mã OTP không chính xác' };
    }
    return { valid: true, message: null };
};

module.exports = {
    validatePassword,
    validateRequiredFields,
    validateOtp,
};
