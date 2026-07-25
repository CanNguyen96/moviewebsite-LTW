const db = require('../config/db');
const { validateComment } = require('../validators/reviewValidator');
const BadRequestError = require('../errors/BadRequestError');

// API: Gửi bình luận (yêu cầu đăng nhập, đã qua middleware authenticateToken)
const createReview = async (req, res, next) => {
    const { movie_id, comment } = req.body;
    const user_id = req.user.user_id;

    const commentResult = validateComment(comment);
    if (!commentResult.valid) {
        return next(new BadRequestError(commentResult.message));
    }

    try {
        const [result] = await db.query(
            "INSERT INTO reviews (movie_id, user_id, comment, review_date) VALUES (?, ?, ?, NOW())",
            [movie_id, user_id, comment]
        );

        const [reviews] = await db.query(
            "SELECT r.review_id, r.comment, r.review_date, u.user_name, u.avatar_url FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.review_id = ?",
            [result.insertId]
        );

        res.status(201).json({
            message: "Gửi bình luận thành công!",
            review: reviews[0]
        });
    } catch (err) {
        next(err);
    }
};

// API: Lấy danh sách bình luận của một phim
const getMovieReviews = async (req, res, next) => {
    const movie_id = req.params.movie_id;

    try {
        const [results] = await db.query(
            'SELECT r.review_id, r.comment, r.review_date, u.user_name, u.avatar_url FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.movie_id = ? ORDER BY r.review_date DESC',
            [movie_id]
        );
        res.json(results);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createReview,
    getMovieReviews
};