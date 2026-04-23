import axiosInstance from '../utils/axiosConfig';

export const userService = {
    // ---------------- Lịch sử xem phim ----------------
    recordWatchHistory: async (movieId) => {
        const response = await axiosInstance.post('/api/watch-history', { movie_id: movieId });
        return response.data;
    },

    getWatchHistory: async () => {
        const response = await axiosInstance.get('/api/watch-history');
        return response.data;
    },

    deleteWatchHistory: async (movieId) => {
        const response = await axiosInstance.delete(`/api/watch-history/${movieId}`);
        return response.data;
    },

    deleteAllWatchHistory: async () => {
        const response = await axiosInstance.delete('/api/watch-history');
        return response.data;
    },

    // ---------------- Phim yêu thích ----------------
    getFavorites: async () => {
        const response = await axiosInstance.get('/api/favorites');
        return response.data;
    },

    checkFavoriteStatus: async (movieId) => {
        const response = await axiosInstance.get(`/api/favorites/${movieId}/status`);
        return response.data;
    },

    addFavorite: async (movieId) => {
        const response = await axiosInstance.post('/api/favorites', { movie_id: movieId });
        return response.data;
    },

    removeFavorite: async (movieId) => {
        const response = await axiosInstance.delete(`/api/favorites/${movieId}`);
        return response.data;
    },

    // ---------------- Hồ sơ (Profile) ----------------
    updateProfile: async (formData) => {
        const response = await axiosInstance.put('/api/user', formData, {
            headers: {
                "Content-Type": "multipart/form-data" 
            }
        });
        return response.data;
    },

    // ---------------- Admin ----------------
    searchUsers: async (userName) => {
        const response = await axiosInstance.get(`/api/users/search?userName=${encodeURIComponent(userName.trim())}`);
        return response.data;
    },

    getUsers: async () => {
        const response = await axiosInstance.get('/api/users');
        return response.data;
    },

    getUserById: async (userId) => {
        const response = await axiosInstance.get(`/api/users/${userId}`);
        return response.data;
    },

    updateUserStatus: async (userId, newStatus) => {
        const response = await axiosInstance.put(`/api/users/${userId}/status`, { status: newStatus });
        return response.data;
    }
};
