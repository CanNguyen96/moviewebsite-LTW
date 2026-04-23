const express = require('express');
const router = express.Router();
const episodesController = require('../controllers/episodesController');

const { authenticateToken, isAdmin } = require('../middlewares/auth');

// API endpoints
router.get('/api/episodes/movie/:movieId', episodesController.getEpisodesByMovieId);  // Lấy danh sách tập phim theo movie_id
router.get('/api/episodes/:episodeId', episodesController.getEpisodeById);          // Lấy chi tiết tập phim
router.post('/api/episodes', authenticateToken, isAdmin, episodesController.addEpisode);                        // Thêm tập phim mới
router.put('/api/episodes/:episodeId', authenticateToken, isAdmin, episodesController.updateEpisode);           // Cập nhật tập phim
router.delete('/api/episodes/:episodeId', authenticateToken, isAdmin, episodesController.deleteEpisode);        // Xóa tập phim

module.exports = router;