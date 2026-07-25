const db = require('../config/db');
const BadRequestError = require('../errors/BadRequestError');

// API: Lấy danh sách thể loại 
const getCategories = async (req, res, next) => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM categories
    `;
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        next(err);
    }
};

const getMoviesByCategoryName = async (req, res, next) => {
    const categoryName = req.params.name ? decodeURIComponent(req.params.name) : null;

    if (!categoryName) {
        return next(new BadRequestError('Thiếu tên thể loại.'));
    }

    const sql = `
        SELECT m.movie_id AS id,
               m.title,
               m.image_url,
               m.description
        FROM   movies m
        JOIN   movie_categories mc ON mc.movie_id = m.movie_id
        JOIN   categories c ON c.category_id = mc.category_id
        WHERE  c.category_name = ?
          AND  m.status = 'Approved'
        ORDER  BY m.movie_id DESC
    `;

    try {
        const [results] = await db.query(sql, [categoryName]);
        // Khi không tìm thấy phim thuộc thể loại này, trả về mảng rỗng [] với mã 200
        res.status(200).json(results);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCategories,
    getMoviesByCategoryName
};