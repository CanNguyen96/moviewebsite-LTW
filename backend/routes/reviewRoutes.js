const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/api/reviews', authenticateToken, reviewController.createReview); // API gửi bình luận (cần đăng nhập)
router.get('/api/reviews/:movie_id', reviewController.getMovieReviews); // API lấy danh sách bình luận

module.exports = router;