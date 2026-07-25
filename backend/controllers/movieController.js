const db = require('../config/db');
const { getFileUrl } = require('../middlewares/upload');
const { validateMovieFields, validateEpisodeFields } = require('../validators/movieValidator');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// API: Lấy danh sách anime cho người dùng ( chỉ approved )
const getMovies = (req, res, next) => {
    const query = `
        SELECT 
            movie_id as id,
            title,
            image_url,
            status,
            views_count,
            average_rating
        FROM movies
        WHERE status = 'Approved'
        ORDER BY movie_id DESC    
    `;

    db.query(query, (err, results) => {
        if (err) return next(err);
        res.json(results);
    });
};

// API: Lấy chi tiết phim kèm danh sách tập
const getMovieDetails = (req, res, next) => {
    const movieId = req.params.id;

    const movieQuery = `
        SELECT 
            m.movie_id,
            m.title,
            m.description,
            m.release_year,
            m.genre,
            m.duration,
            m.image_url,
            m.background_url,
            m.status,
            m.average_rating AS avg_rating,
            m.views_count,
            (SELECT COUNT(r.review_id) FROM reviews r WHERE r.movie_id=m.movie_id) AS total_reviews
        FROM movies m
        WHERE m.movie_id = ? AND m.status = 'Approved'
    `;

    const episodeQuery = `
        SELECT 
            episode_id,
            movie_id,
            episode_number AS episode,
            title,
            video_url
        FROM episodes
        WHERE movie_id = ?
        ORDER BY episode ASC
    `;

    db.query(movieQuery, [movieId], (err, movieResult) => {
        if (err) return next(err);
        if (movieResult.length === 0) return next(new NotFoundError("Không tìm thấy phim"));

        const movie = movieResult[0];

        // Format avg_rating nếu có
        if (movie.avg_rating !== null) {
            movie.avg_rating = parseFloat(movie.avg_rating).toFixed(1);
        } else {
            movie.avg_rating = "10";
        }
        
        db.query(episodeQuery, [movieId], (err, episodeResults) => {
            if (err) return next(err);

            movie.episodes = Array.isArray(episodeResults) ? episodeResults : [];
            res.json(movie);
        });
    });
};

// API: Lấy danh sách cho quản trị viên ( approved or pending)
const getMoviesAdmin = (req, res, next) => {
    const query = `
        SELECT 
            m.movie_id,
            m.title,
            m.image_url,
            m.status,
            m.genre,
            m.description,
            m.release_year AS year,
            m.duration,
            COUNT(e.episode_id) AS episodes
        FROM movies m
        LEFT JOIN episodes e ON m.movie_id = e.movie_id
        GROUP BY m.movie_id 
        ORDER BY m.movie_id DESC
    `;

    db.query(query, (err, results) => {
        if (err) return next(err);
        res.json(results);
    });
};

// API: Lấy thông tin phim theo ID
const getMovieById = (req, res, next) => {
    const movieId = req.params.movie_id;
    const query = `
        SELECT
            m.movie_id,
            m.title,
            TRIM(m.image_url) AS image_url,
            m.status,
            TRIM(m.genre) AS genre,
            m.release_year AS release_year,
            m.duration,
            m.description,
            m.background_url,
            COUNT(e.episode_id) AS episodes_count
        FROM movies m
        LEFT JOIN episodes e ON m.movie_id = e.movie_id
        WHERE m.movie_id = ?
        GROUP BY m.movie_id
    `;

    db.query(query, [movieId], (err, result) => {
        if (err) return next(err);
        if (result.length === 0) {
            return next(new NotFoundError('Không tìm thấy phim'));
        }
        const movieData = result[0];
        movieData.image_url = movieData.image_url ? movieData.image_url.trim() : '';
        movieData.background_url = movieData.background_url ? movieData.background_url.trim() : '';
        res.status(200).json(movieData);
    });
};

// API: Cập nhật thông tin phim (cập nhật cả thể loại)
const updateMovie = (req, res, next) => {
    const movieId = req.params.movie_id;
    const {
        title,
        genre,
        release_year,
        duration,
        status,
        description,
    } = req.body;

    // Validation đầu vào
    const validation = validateMovieFields({ title, genre, release_year, duration, status, description });
    if (!validation.valid) {
        return next(new BadRequestError(validation.message));
    }
    const image_url = req.files['image']
        ? getFileUrl(req.files['image'][0])
        : req.body.existing_image_url;

    const background_url = req.files['background']
        ? getFileUrl(req.files['background'][0])
        : req.body.existing_background_url;

    const updateMovieSql = `
        UPDATE movies
        SET    
            title=?, 
            genre=?,         
            release_year=?,
            duration=?,
            status=?,
            description=?,
            image_url=?,
            background_url=?
        WHERE movie_id=?
    `;

    db.query(updateMovieSql, [title, genre, release_year, duration, status, description, image_url, background_url, movieId], (err, result) => {
        if (err) return next(err);

        if (result.affectedRows === 0) {
            return next(new NotFoundError('Không tìm thấy phim để cập nhật'));
        }

        // Bước 2: Xóa các thể loại cũ
        const deleteOldCategoriesSql = `DELETE FROM movie_categories WHERE movie_id = ?`;
        db.query(deleteOldCategoriesSql, [movieId], (errDelete) => {
            if (errDelete) return next(errDelete);

            // Bước 3: Xử lý lại genre mới
            const genreNames = genre.split(',').map(name => name.trim()).filter(name => name !== '');
            if (genreNames.length === 0) {
                return res.status(200).json({ message: 'Cập nhật phim thành công (không có thể loại để cập nhật).' });
            }

            // Bước 4: Tìm category_id tương ứng
            const findCategoriesSql = `
                SELECT category_id FROM categories WHERE category_name IN (?)
            `;
            db.query(findCategoriesSql, [genreNames], (errFind, categories) => {
                if (errFind) return next(errFind);

                if (categories.length === 0) {
                    return res.status(200).json({ message: 'Cập nhật phim thành công nhưng không tìm thấy thể loại tương ứng.' });
                }

                // Bước 5: Chèn mới vào bảng movie_categories
                const movieCategoriesValues = categories.map(row => [movieId, row.category_id]);
                const insertMovieCategoriesSql = `
                    INSERT INTO movie_categories (movie_id, category_id) VALUES ?
                `;
                db.query(insertMovieCategoriesSql, [movieCategoriesValues], (errInsert) => {
                    if (errInsert) return next(errInsert);

                    // Thành công hoàn toàn
                    res.status(200).json({ message: `Cập nhật phim và ${categories.length} thể loại thành công.` });
                });
            });
        });
    });
};

// API: Thêm tập phim cho bộ phim
const addEpisode = (req, res, next) => {
    const { movieId } = req.params;
    const { episode_number, title, video_url } = req.body;

    const epValidation = validateEpisodeFields({ episode_number, title, video_url });
    if (!epValidation.valid) {
        return next(new BadRequestError(epValidation.message));
    }

    const sql = 'INSERT INTO episodes (movie_id, episode_number, title, video_url) VALUES (?, ?, ?, ?)';
    db.query(sql, [movieId, episode_number, title, video_url], (err, result) => {
        if (err) return next(err);
        res.status(201).json({ message: 'Tập phim đã được thêm thành công' });
    });
};

// API: Thêm một bộ phim
const addMovie = (req, res, next) => {
    const {
        title,
        description,
        release_year, 
        genre,
        duration,
        status: statusFromRequest, 
    } = req.body;

    // >>> Xử lý giá trị mặc định cho status trước khi dùng trong validation/query <<<
    const finalStatus = statusFromRequest || 'Pending';

    // Basic validation
    if (!title || !title.trim() || !description || !description.trim() || !release_year || !duration || !genre || !finalStatus) {
        return next(new BadRequestError('Thiếu thông tin phim bắt buộc (title, description, year, duration, genre, status).'));
    }
    const movieValidation = validateMovieFields({ title, description, genre, release_year, duration, status: finalStatus });
    if (!movieValidation.valid) {
        return next(new BadRequestError(movieValidation.message));
    }
    // Xử lý file ảnh từ req.files (do upload.fields middleware đưa vào)
    const imageFile = req.files?.image?.[0];
    const backgroundFile = req.files?.background?.[0];

    // Kiểm tra file ảnh
    if (!imageFile || !backgroundFile) {
        return next(new BadRequestError('Thiếu ảnh phim hoặc ảnh nền.'));
    }

    // Lưu đường dẫn vào DB (dùng path tương đối tới public/images)
    const image_url = getFileUrl(imageFile);
    const background_url = getFileUrl(backgroundFile);

    const genreForDb = String(genre).slice(0, 45);
    const sql = `
        INSERT INTO movies (title, description, release_year, duration, image_url, genre, status, background_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Chuẩn bị mảng các giá trị để thay thế cho dấu ?
    const values = [
        title,
        description,
        release_year,
        duration,
        image_url,
        genreForDb,
        finalStatus, 
        background_url 
    ];

    // 1. Thêm phim vào bảng movies
    db.query(sql, values, (err, result) => {
        if (err) return next(err);
        
        if (result.affectedRows === 1) {
            const newMovieId = result.insertId; // Lấy movie_id vừa tạo

            // 2.Xử lý chuỗi genre và tìm cateogory_id
            const genreNames = genre.split(',').map(name => name.trim()).filter(name => name !== '');

            if (genreNames.length === 0) {
                return res.status(201).json({
                    message: 'Thêm phim thành công ( Không có thể loại nào được liên kết )',
                    movie_id: newMovieId,
                    image_url,
                    background_url
                });
            }
            // Chuẩn bị truy vấn để tìm category_id cho tên các thể loại 
            const findCategoriesSql = ` SELECT 
                                            category_id 
                                        FROM categories 
                                        WHERE category_name IN (?)`;
            db.query(findCategoriesSql, [genreNames], (errCategories, resultCategories) => {
                if (errCategories) return next(errCategories);
                
                if (resultCategories.length === 0) {
                    return res.status(201).json({
                        message: 'Thêm phim thành công, nhưng không tìm thấy thể loại nào tương ứng để liên kết',
                        movie_id: newMovieId,
                        image_url,
                        background_url
                    });
                }
                // 3. Chuẩn bị và thêm dữ liêu vào bảng movie_categories
                const movieCategoriesValues = resultCategories.map(row => [newMovieId, row.category_id]);

                const insertMovieCategoriesSql = `INSERT INTO movie_categories (
                                                        movie_id, 
                                                        category_id)
                                                VALUES ?
                                                `;
                db.query(insertMovieCategoriesSql, [movieCategoriesValues], (errMovieCategories, resultMovieCategories) => {
                    if (errMovieCategories) return next(errMovieCategories);
                    
                    // Kiểm tra số lượng bản ghi đã được thêm vào movie_categories
                    if (resultMovieCategories.affectedRows > 0) {
                        // 4. Hoàn thành: Gửi phản hồi thành công thêm phim và liên kết thể loại
                        res.status(201).json({
                            message: `Thêm phim thành công và liên kết với ${resultMovieCategories.affectedRows} thể loại.`,
                            movie_id: newMovieId,
                            image_url,
                            background_url
                        });
                    } else {
                        res.status(201).json({
                            message: 'Thêm phim thành công, nhưng không thêm được dữ liệu vào bảng movie_categories',
                            movie_id: newMovieId,
                            image_url,
                            background_url
                        });
                    }
                });
            });
        } else {
             return next(new Error('Thêm phim thất bại, không có hàng nào được thêm vào cơ sở dữ liệu.'));
        }
    });
};

// API: Xóa một bộ phim
const deleteMovie = (req, res, next) => {
    const movieId = req.params.movie_id;

    if (!movieId) {
        return next(new BadRequestError('Thiếu ID phim cần xóa.'));
    }

    // Câu lệnh SQL để xóa phim
    const sql = 'DELETE FROM movies WHERE movie_id = ?';

    // Thực thi câu lệnh SQL
    db.query(sql, [movieId], (err, result) => {
        if (err) return next(err);

        // Kiểm tra xem có dòng nào bị ảnh hưởng (tức là có phim được xóa) hay không
        if (result.affectedRows === 0) {
            return next(new NotFoundError('Không tìm thấy phim để xóa'));
        }

        // Xóa thành công
        res.status(200).json({ message: 'Xóa phim thành công' });
    });
};

// API: Lấy danh sách phim hiện thị Slider
const getSliderMovie = (req, res, next) => {
    const query = `
        SELECT
            movie_id,
            title,
            image_url,
            background_url,
            genre,
            description,
            views_count,
            average_rating,
            release_year,
            (SELECT MAX(episode_number) FROM episodes WHERE movie_id = movies.movie_id) AS latest_episode
        FROM movies
        WHERE status = 'Approved' 
        ORDER BY movie_id DESC 
        LIMIT 8
    `;
    db.query(query, (err, result) => {
        if (err) return next(err);
        res.status(200).json(result);
    });
};

// API: Tìm kiếm phim theo tiêu đề
const searchMovies = (req, res, next) => {
    const keyword = req.query.q;
    if (!keyword) {
        return next(new BadRequestError('Vui lòng nhập từ khóa tìm kiếm.'));
    }

    const likeKeyword = `%${keyword}%`;
    const sql = `
        SELECT 
            movie_id AS id,
            title,
            image_url,
            genre,
            description,
            status,
            views_count,
            average_rating
        FROM movies
        WHERE title LIKE ? AND status = 'Approved'
        ORDER BY movie_id DESC
    `;

    db.query(sql, [likeKeyword], (err, results) => {
        if (err) return next(err);
        res.status(200).json(results);
    });
};

const searchMoviesForAdmin = (req, res, next) => {
    const searchTerm = req.query.movieName;

    if (!searchTerm) {
        return next(new BadRequestError("Vui lòng nhập từ khóa tìm kiếm"));
    }

    const sql = `SELECT 
                    m.movie_id,
                    m.title,
                    m.image_url,
                    m.genre,
                    m.description,
                    m.duration,
                    m.release_year,
                    m.status,
                    COUNT(e.episode_id) AS episodes
                FROM movies m
                LEFT JOIN episodes e ON m.movie_id = e.movie_id
                WHERE m.title LIKE ? 
                GROUP BY m.movie_id
                ORDER BY m.movie_id DESC`;
    const searchPattern = `%${searchTerm}%`;
    db.query(sql, [searchPattern], (err, results) => {
        if (err) return next(err);
        if (results.length === 0) {
            return next(new NotFoundError("Không tìm thấy phim phù hợp."));
        }
        res.status(200).json(results);
    });
};

// API: Tăng lượt xem phim
const addView = (req, res, next) => {
    const movieId = req.params.id;

    const sql = 'UPDATE movies SET views_count = views_count + 1 WHERE movie_id = ?';
    db.query(sql, [movieId], (err, result) => {
        if (err) return next(err);
        res.status(200).json({ message: 'Tăng lượt xem thành công' });
    });
};

module.exports = {
    getMovies,
    getMovieDetails,
    getMoviesAdmin,
    getMovieById,
    updateMovie,
    addEpisode,
    addMovie,
    deleteMovie,
    getSliderMovie,
    searchMovies,
    searchMoviesForAdmin,
    addView
};
