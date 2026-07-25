const db = require('../config/db');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// API: Lấy danh sách lịch sử xem phim
const getWatchHistory = async (req, res, next) => {
    const userId = req.user.user_id;
    const sql = `
        SELECT m.movie_id, m.title, m.description, m.image_url, wh.watched_at
        FROM watchhistory wh
        JOIN movies m ON wh.movie_id = m.movie_id
        WHERE wh.user_id = ?
        ORDER BY wh.watched_at DESC
    `;
    try {
        const [result] = await db.query(sql, [userId]);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// API: Thêm lịch sử xem phim (dùng transaction an toàn với try...finally connection.release())
const addWatchHistory = async (req, res, next) => {
    const userId = req.user.user_id;
    const { movie_id } = req.body;

    if (!movie_id) {
        return next(new BadRequestError("Thiếu movie_id"));
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const deleteSql = `DELETE FROM watchhistory WHERE user_id = ? AND movie_id = ?`;
        await connection.query(deleteSql, [userId, movie_id]);

        const insertSql = `INSERT INTO watchhistory (user_id, movie_id, watched_at) VALUES (?, ?, NOW())`;
        await connection.query(insertSql, [userId, movie_id]);

        await connection.commit();
        res.status(201).json({ message: "Đã ghi lịch sử xem phim" });
    } catch (err) {
        if (connection) await connection.rollback();
        next(err);
    } finally {
        if (connection) connection.release(); // Đảm bảo luôn trả connection về pool
    }
};

// API: Xóa một bản ghi lịch sử xem phim
const deleteWatchHistoryItem = async (req, res, next) => {
    const userId = req.user.user_id;
    const { movie_id } = req.params;

    const sql = `DELETE FROM watchhistory WHERE user_id = ? AND movie_id = ?`;
    try {
        const [result] = await db.query(sql, [userId, movie_id]);
        if (result.affectedRows === 0) {
            return next(new NotFoundError("Không tìm thấy bản ghi lịch sử"));
        }
        res.status(200).json({ message: "Đã xóa bản ghi lịch sử xem phim" });
    } catch (err) {
        next(err);
    }
};

// API: Xóa toàn bộ lịch sử xem phim
const deleteAllWatchHistory = async (req, res, next) => {
    const userId = req.user.user_id;

    const sql = `DELETE FROM watchhistory WHERE user_id = ?`;
    try {
        await db.query(sql, [userId]);
        res.status(200).json({ message: "Đã xóa toàn bộ lịch sử xem phim" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getWatchHistory,
    addWatchHistory,
    deleteWatchHistoryItem,
    deleteAllWatchHistory,
};