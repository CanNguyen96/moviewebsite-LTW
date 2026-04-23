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

    // Lấy thông tin chi tiết phim để sửa
    getMovieForEdit: async (id) => {
        const response = await axiosInstance.get(`/api/movies/${id}/edit`);
        return response.data;
    },

    // Xóa phim
    deleteMovie: async (id) => {
        const response = await axiosInstance.delete(`/api/movies/${id}`);
        return response.data;
    },

    // Lấy tất cả phim (dành cho User)
    getMovies: async () => {
        const response = await axiosInstance.get('/api/movies');
        return response.data;
    },

    // Thêm phim mới
    addMovie: async (formData) => {
        const response = await axiosInstance.post('/api/movies/add', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Cập nhật phim
    updateMovie: async (id, formData) => {
        const response = await axiosInstance.put(`/api/movies/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Tìm kiếm phim
    searchMovies: async (query) => {
        const response = await axiosInstance.get(`/api/search?q=${query}`);
        return response.data;
    },

    // Tìm kiếm phim cho admin
    searchAdminMovies: async (movieName) => {
        const response = await axiosInstance.get(`/api/movies/searchAdmin?movieName=${encodeURIComponent(movieName.trim())}`);
        return response.data;
    },

    // Lấy phim cho Slider
    getSliderMovies: async () => {
        const response = await axiosInstance.get('/api/slider-movies');
        return response.data;
    },

    // Lấy phim theo danh mục
    getCategoryMovies: async (categoryName) => {
        const response = await axiosInstance.get(`/api/categories/${categoryName}`);
        return response.data;
    },

    // Lấy danh sách danh mục (thể loại)
    getCategories: async () => {
        const response = await axiosInstance.get('/api/categories');
        return response.data;
    },

    // Thêm tập phim mới
    addEpisode: async (data) => {
        const response = await axiosInstance.post(`/api/episodes`, data);
        return response.data;
    },

    // Cập nhật tập phim
    updateEpisode: async (episodeId, data) => {
        const response = await axiosInstance.put(`/api/episodes/${episodeId}`, data);
        return response.data;
    },

    // Lấy danh sách tập phim
    getEpisodes: async (movieId) => {
        const response = await axiosInstance.get(`/api/episodes/movie/${movieId}`);
        return response.data;
    },

    // Xóa tập phim
    deleteEpisode: async (episodeId) => {
        const response = await axiosInstance.delete(`/api/episodes/${episodeId}`);
        return response.data;
    },

    // Tăng lượt xem phim
    increaseView: async (movieId) => {
        const response = await axiosInstance.post(`/api/movies/${movieId}/view`);
        return response.data;
    },

    // Đánh giá phim
    rateMovie: async (movieId, rating) => {
        const response = await axiosInstance.post(`/api/movies/${movieId}/rate`, { rating });
        return response.data;
    }
};
