const db = require('../config/db');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// API: Lấy danh sách tập phim theo movie_id
const getEpisodesByMovieId = (req, res, next) => {
    const movieId = req.params.movieId;

    if (!movieId) {
        return next(new BadRequestError('Thiếu movie_id.'));
    }

    const query = `
        SELECT
            episode_id,
            movie_id,
            episode_number,
            title,
            video_url
        FROM episodes
        WHERE movie_id = ?
        ORDER BY episode_number ASC
    `;

    db.query(query, [movieId], (err, results) => {
        if (err) return next(err);

        if (results.length === 0) {
            return next(new NotFoundError('Không tìm thấy tập phim cho phim này.'));
        }

        res.status(200).json(results);
    });
};

// API: Lấy thông tin chi tiết của một tập phim theo episode_id
const getEpisodeById = (req, res, next) => {
    const episodeId = req.params.episodeId;

    if (!episodeId) {
        return next(new BadRequestError('Thiếu episode_id.'));
    }

    const query = `
        SELECT
            episode_id,
            movie_id,
            episode_number,
            title,
            video_url
        FROM episodes
        WHERE episode_id = ?
    `;

    db.query(query, [episodeId], (err, results) => {
        if (err) return next(err);

        if (results.length === 0) {
            return next(new NotFoundError('Không tìm thấy tập phim này.'));
        }

        res.status(200).json(results[0]);
    });
};

// API: Thêm tập phim mới
const addEpisode = (req, res, next) => {
    const { movie_id, episode_number, title, video_url } = req.body;

    if (!movie_id || !episode_number || !title || !video_url) {
        return next(new BadRequestError('Thiếu thông tin cần thiết (movie_id, episode_number, title, video_url).'));
    }

    const query = `
        INSERT INTO episodes (movie_id, episode_number, title, video_url)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [movie_id, episode_number, title, video_url], (err, results) => {
        if (err) return next(err);

        res.status(201).json({ message: 'Thêm tập phim thành công!', episode_id: results.insertId });
    });
};

// API: Xóa tập phim theo episode_id
const deleteEpisode = (req, res, next) => {
    const episodeId = req.params.episodeId;

    if (!episodeId) {
        return next(new BadRequestError('Thiếu episode_id.'));
    }

    const query = `
        DELETE FROM episodes
        WHERE episode_id = ?
    `;

    db.query(query, [episodeId], (err, results) => {
        if (err) return next(err);

        if (results.affectedRows === 0) {
            return next(new NotFoundError('Không tìm thấy tập phim để xóa.'));
        }

        res.status(200).json({ message: 'Xóa tập phim thành công!' });
    });
};

// API: Cập nhật tập phim theo episode_id
const updateEpisode = (req, res, next) => {
    const episodeId = req.params.episodeId;
    const { movie_id, episode_number, title, video_url } = req.body;

    if (!episodeId || !movie_id || !episode_number || !title || !video_url) {
        return next(new BadRequestError('Thiếu thông tin cần thiết.'));
    }

    const query = `
        UPDATE episodes
        SET movie_id = ?, episode_number = ?, title = ?, video_url = ?
        WHERE episode_id = ?
    `;

    db.query(query, [movie_id, episode_number, title, video_url, episodeId], (err, results) => {
        if (err) return next(err);

        if (results.affectedRows === 0) {
            return next(new NotFoundError('Không tìm thấy tập phim để cập nhật.'));
        }

        res.status(200).json({ message: 'Cập nhật tập phim thành công!' });
    });
};

// Thêm vào module.exports
module.exports = {
    getEpisodesByMovieId,
    getEpisodeById,
    addEpisode,
    deleteEpisode,
    updateEpisode 
};