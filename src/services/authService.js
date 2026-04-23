import axiosInstance from '../utils/axiosConfig';

export const authService = {
    // Đăng nhập bằng tài khoản/mật khẩu
    login: async (email, password) => {
        const response = await axiosInstance.post('/login', { email, password });
        return response.data;
    },

    // Đăng nhập bằng Google
    googleLogin: async (credentialToken) => {
        const response = await axiosInstance.post('/google', { token: credentialToken });
        return response.data;
    },

    // Gửi OTP Đăng ký
    sendRegisterOtp: async (name, email) => {
        const response = await axiosInstance.post('/send-register-otp', { name, email });
        return response.data;
    },

    // Đăng ký tài khoản (cần OTP)
    register: async (name, email, password, otp) => {
        const response = await axiosInstance.post('/register', { name, email, password, otp });
        return response.data;
    },

    // Gửi OTP Quên mật khẩu
    sendForgotOtp: async (userName, email) => {
        const response = await axiosInstance.post('/send-forgot-otp', { user_name: userName, email });
        return response.data;
    },

    // Xác nhận OTP và đặt lại mật khẩu mới
    forgotPassword: async (userName, email, otp, newPassword) => {
        const response = await axiosInstance.put('/forgot-password', {
            user_name: userName,
            email,
            otp,
            new_password: newPassword
        });
        return response.data;
    }
};
