const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const ratingController = require('../controllers/ratingController');
const upload = require('../middlewares/upload');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

router.get('/api/movies/searchAdmin', authenticateToken, isAdmin, movieController.searchMoviesForAdmin);
router.get('/api/movies/search', movieController.searchMovies); // Tìm kiếm phim theo tên
router.get('/api/movies', movieController.getMovies); // Lấy danh sách phim cho người dùng ( chỉ approved )
router.get('/api/movies/:id', movieController.getMovieDetails); // Lấy chi tiết phim kèm danh sách tập 
router.get('/api/moviesad', authenticateToken, isAdmin, movieController.getMoviesAdmin); // Lấy danh sách cho quản trị viên ( approved or pending )
router.get('/api/movies/:movie_id/edit', authenticateToken, isAdmin, movieController.getMovieById); // Lấy thông tin phim theo ID
router.put('/api/movies/:movie_id', authenticateToken, isAdmin, upload.fields([ { name: 'image', maxCount: 1 },{ name: 'background', maxCount: 1 }]),movieController.updateMovie); // Cập nhật thông tin phim
router.post('/api/movies/:movieId/episodes', authenticateToken, isAdmin, movieController.addEpisode); // Thêm tập phim cho bộ phim 
router.delete('/api/movies/:movie_id', authenticateToken, isAdmin, movieController.deleteMovie); // Xóa một bộ phim 
router.get('/api/slider-movies', movieController.getSliderMovie); // Lấy danh sách phim hiện thị Slider
router.post('/api/movies/add', authenticateToken, isAdmin, upload.fields([ { name: 'image', maxCount: 1 },{ name: 'background', maxCount: 1 }]), movieController.addMovie);

// Tăng lượt xem phim
router.post('/api/movies/:id/view', movieController.addView);

// Đánh giá phim
router.post('/api/movies/:id/rate', authenticateToken, ratingController.rateMovie);
router.get('/api/movies/:id/rate', authenticateToken, ratingController.getUserRating);

module.exports = router;