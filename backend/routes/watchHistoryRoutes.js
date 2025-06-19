const express = require('express');
const router = express.Router();
const watchHistoryController = require('../controllers/watchHistoryController');
const { authenticateToken } = require('../middlewares/auth'); 

router.post('/api/watch-history', authenticateToken, watchHistoryController.addWatchHistory); // APT Thêm lịch sử   
router.get('/api/watch-history', authenticateToken, watchHistoryController.getWatchHistory); // API Lấy danh sách lịch sử
router.delete('/api/watch-history/:movie_id', authenticateToken, watchHistoryController.deleteWatchHistoryItem); // API Xóa lịch sử
router.delete('/api/watch-history', authenticateToken, watchHistoryController.deleteAllWatchHistory);  // API Xóa toàn bộ lịch sử

module.exports = router;