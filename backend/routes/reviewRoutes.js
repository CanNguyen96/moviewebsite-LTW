const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/api/reviews', reviewController.createReview); // API gửi đánh giá
router.get('/api/reviews/:movie_id', reviewController.getMovieReviews); // API lấy đánh giá

module.exports = router;