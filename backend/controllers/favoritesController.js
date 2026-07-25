const db = require('../config/db');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// API: Thêm phim vào danh sách yêu thích
const addFavorite = async (req, res, next) => {
    const userId = req.user.user_id;
    const { movie_id } = req.body;

    if (!movie_id) {
        return next(new BadRequestError("Thiếu movie_id"));
    }

    const sql = `INSERT IGNORE INTO favorites (user_id, movie_id) VALUES (?,?)`;
    try {
        const [result] = await db.query(sql, [userId, movie_id]);
        if (result.affectedRows > 0) {
            res.status(201).json({ message: "Đã thêm vào danh sách phim yêu thích" });
        } else {
            res.status(200).json({ message: "Phim đã có trong danh sách yêu thích" });
        }
    } catch (err) {
        next(err);
    }
};

// API: Xóa phim khỏi danh sách yêu thích
const removeFavorite = async (req, res, next) => {
    const userId = req.user.user_id;
    const movieId = req.params.movieId;

    if (!movieId) {
        return next(new BadRequestError("Thiếu movie_id"));
    }

    const sql = `DELETE FROM favorites WHERE user_id=? AND movie_id=? `;
    try {
        const [result] = await db.query(sql, [userId, movieId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Đã xóa phim khỏi danh sách yêu thích" });
        } else {
            return next(new NotFoundError("Phim không có trong danh sách yêu thích"));
        }
    } catch (err) {
        next(err);
    }
};

// API: Kiểm tra trạng thái yêu thích của một phim
const checkFavoriteStatus = async (req, res, next) => {
    const userId = req.user.user_id;
    const movieId = req.params.movieId;

    if (!movieId) {
        return next(new BadRequestError("Thiếu movie_id"));
    }

    const sql = `SELECT 1 FROM favorites WHERE user_id=? AND movie_id=? LIMIT 1`;
    try {
        const [result] = await db.query(sql, [userId, movieId]);
        const isFavorite = result.length > 0;
        res.status(200).json({ isFavorite });
    } catch (err) {
        next(err);
    }
};

// API lấy danh sách phim yêu thích
const getFavorites = async (req, res, next) => {
    const userId = req.user.user_id;
    const sql = `
        SELECT m.movie_id, m.title, m.description, m.image_url
        FROM favorites f
        JOIN movies m ON f.movie_id = m.movie_id
        WHERE f.user_id=?
    `;
    try {
        const [result] = await db.query(sql, [userId]);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    checkFavoriteStatus,
    getFavorites,
};