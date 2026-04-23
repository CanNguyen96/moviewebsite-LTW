import axiosInstance from '../utils/axiosConfig';

export const movieService = {
    // Lấy danh sách phim cho admin
    getAdminMovies: async () => {
        const response = await axiosInstance.get('/api/moviesad');
        return response.data;
    },

    // Lấy thông tin chi tiết phim
    getMovieById: async (id) => {
        const response = await axiosInstance.get(`/api/movies/${id}`);
        return response.data;
    },

    // Xóa phim
    deleteMovie: async (id) => {
        const response = await axiosInstance.delete(`/api/movies/${id}`);
        return response.data;
    },

    // Các hàm khác sẽ được thêm vào trong quá trình refactor...
};
