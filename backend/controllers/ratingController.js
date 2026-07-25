const db = require('../config/db');
const BadRequestError = require('../errors/BadRequestError');

// API: Đánh giá phim (yêu cầu đăng nhập)
const rateMovie = async (req, res, next) => {
    const { rating } = req.body;
    const user_id = req.user.user_id;
    const movie_id = req.params.id;

    if (!rating || rating < 1 || rating > 10) {
        return next(new BadRequestError("Điểm đánh giá phải từ 1 đến 10!"));
    }

    try {
        // Insert hoặc Update rating
        await db.query(
            "INSERT INTO movie_ratings (user_id, movie_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?",
            [user_id, movie_id, rating, rating]
        );

        // Tính lại average_rating cho phim
        const [rows] = await db.query(
            "SELECT AVG(rating) as avg_rating FROM movie_ratings WHERE movie_id = ?",
            [movie_id]
        );

        const newAvg = rows[0].avg_rating ? parseFloat(rows[0].avg_rating).toFixed(1) : null;

        // Cập nhật bảng movies
        await db.query(
            "UPDATE movies SET average_rating = ? WHERE movie_id = ?",
            [newAvg, movie_id]
        );

        res.status(200).json({ message: "Đánh giá thành công!", average_rating: newAvg });
    } catch (err) {
        next(err);
    }
};

// API: Lấy đánh giá của user hiện tại cho một phim
const getUserRating = async (req, res, next) => {
    const user_id = req.user.user_id;
    const movie_id = req.params.id;

    try {
        const [rows] = await db.query(
            "SELECT rating FROM movie_ratings WHERE user_id = ? AND movie_id = ?",
            [user_id, movie_id]
        );
        if (rows.length > 0) {
            res.status(200).json({ rating: rows[0].rating });
        } else {
            res.status(200).json({ rating: null });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    rateMovie,
    getUserRating
};
