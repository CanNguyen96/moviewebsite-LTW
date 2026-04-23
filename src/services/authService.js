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

    // Đăng ký tài khoản
    register: async (name, email, password) => {
        const response = await axiosInstance.post('/register', { name, email, password });
        return response.data;
    },

    // Các tính năng quên mật khẩu...
    forgotPassword: async (userName, email, newPassword) => {
        const response = await axiosInstance.post('/forgot-password', {
            user_name: userName,
            email,
            new_password: newPassword
        });
        return response.data;
    }
};
