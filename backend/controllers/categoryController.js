const db = require('../config/db');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// API: Lấy danh sách thể loại 
const getCategories = (req, res, next) => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM categories
    `; 
    db.query(query, (err, results) => {
        if (err) return next(err);
        res.json(results);
    });
};

const getMoviesByCategoryName = (req, res, next) => {
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

  db.query(sql, [categoryName], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return next(new NotFoundError('Không tìm thấy phim theo thể loại này.'));
    }

    res.status(200).json(results);
  });
};


module.exports={
    getCategories,
    getMoviesByCategoryName
}