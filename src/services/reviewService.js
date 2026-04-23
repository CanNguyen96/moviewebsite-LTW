import axiosInstance from '../utils/axiosConfig';

export const reviewService = {
    // Lấy đánh giá của một phim
    getReviewsByMovieId: async (movieId) => {
        const response = await axiosInstance.get(`/api/reviews/${movieId}`);
        return response.data;
    },

    // Gửi đánh giá mới
    addReview: async (movieId, comment) => {
        const response = await axiosInstance.post('/api/reviews', { movie_id: movieId, comment });
        return response.data;
    }
};
