/**
 * Kiểm tra độ mạnh mật khẩu.
 */
export const validatePassword = (password) => {
    if (!password || password.length < 6)
        return 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!/\d/.test(password))
        return 'Mật khẩu phải chứa ít nhất 1 chữ số (0-9)';
    if (!/[!@#$%^&*()\[\]{}|<>?~=_+\-]/.test(password))
        return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
    return null;
};

/**
 * Kiểm tra mật khẩu xác nhận có khớp không.
 */
export const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return 'Mật khẩu nhập lại không khớp!';
    }
    return null;
};
