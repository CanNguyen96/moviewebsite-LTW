const db = require('../config/db');

// API: Đánh giá phim (yêu cầu đăng nhập)
const rateMovie = (req, res) => {
    const { rating } = req.body;
    const user_id = req.user.user_id;
    const movie_id = req.params.id;

    if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({ error: "Điểm đánh giá phải từ 1 đến 10!" });
    }

    // Insert hoặc Update rating
    db.query(
        "INSERT INTO movie_ratings (user_id, movie_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?",
        [user_id, movie_id, rating, rating],
        (err, result) => {
            if (err) {
                console.log('Lỗi khi đánh giá phim:', err);
                return res.status(500).json({ error: err.message });
            }

            // Tính lại average_rating cho phim
            db.query(
                "SELECT AVG(rating) as avg_rating FROM movie_ratings WHERE movie_id = ?",
                [movie_id],
                (err, rows) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    const newAvg = rows[0].avg_rating || 0;

                    // Cập nhật bảng movies
                    db.query(
                        "UPDATE movies SET average_rating = ? WHERE movie_id = ?",
                        [newAvg, movie_id],
                        (err, updateResult) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                            res.status(200).json({ message: "Đánh giá thành công!", average_rating: newAvg });
                        }
                    );
                }
            );
        }
    );
};

// API: Lấy đánh giá của user hiện tại cho một phim
const getUserRating = (req, res) => {
    const user_id = req.user.user_id;
    const movie_id = req.params.id;

    db.query(
        "SELECT rating FROM movie_ratings WHERE user_id = ? AND movie_id = ?",
        [user_id, movie_id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (rows.length > 0) {
                res.status(200).json({ rating: rows[0].rating });
            } else {
                res.status(200).json({ rating: null });
            }
        }
    );
};

module.exports = {
    rateMovie,
    getUserRating
};
