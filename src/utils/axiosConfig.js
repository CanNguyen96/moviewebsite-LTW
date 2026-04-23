import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor cho Request: Tự động đính kèm token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho Response: Xử lý lỗi tập trung
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;

            // Xử lý lỗi token hết hạn hoặc không hợp lệ
            if (status === 401 || status === 403) {
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');

                // Tránh reload liên tục, chỉ redirect nếu chưa ở trang login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } else if (status >= 500) {
                toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
            }
        } else if (error.request) {
            // Lỗi mạng, không kết nối được server
            toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
