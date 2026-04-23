import axiosInstance from '../utils/axiosConfig';

export const userService = {
    // Ghi lại lịch sử xem phim
    recordWatchHistory: async (movieId) => {
        const response = await axiosInstance.post('/api/watch-history', { movie_id: movieId });
        return response.data;
    }
    // Các hàm khác như getProfile, updateProfile... sẽ được thêm sau
};
