const db = require('../config/db');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// API: Lấy danh sách tài khoản người dùng
const getUsers = async (req, res, next) => {
    const sql = `SELECT user_id, user_name, email, role_id, created_at, TRIM(status) AS status, avatar_url
                FROM users
                WHERE role_id=4
                ORDER BY created_at DESC
                `;
  
    try {
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        next(err);
    }
};

// Lấy thông tin tài khoàn người dùng theo ID
const getUserById = async (req, res, next) => {
    const userId = req.params.user_id;
    const sql = 'SELECT user_id, user_name, email, role_id, created_at, status, avatar_url FROM users WHERE user_id = ?';

    try {
        const [result] = await db.query(sql, [userId]);
        if (result.length === 0) {
            return next(new NotFoundError('Không tìm thấy user'));
        }
        res.status(200).json(result[0]);
    } catch (err) {
        next(err);
    }
};

// API: Cập nhật trạng thái người dùng ( Active or Banned )
const updateUserStatus = async (req, res, next) => {
    const userId = req.params.user_id;
    const { status } = req.body;
    
    if (!status || (status !== 'Active' && status !== 'Banned')) {
        return next(new BadRequestError('Status không hợp lệ'));
    }

    const sql = 'UPDATE users SET status = ? WHERE user_id = ?';
    try {
        await db.query(sql, [status, userId]);
        
        const getUserSql = 'SELECT user_id, user_name, email, role_id, created_at, TRIM(status) AS status, avatar_url FROM users WHERE user_id = ?';
        const [results] = await db.query(getUserSql, [userId]);
        if (results.length === 0) {
            return next(new NotFoundError('Không tìm thấy user'));
        }
        res.status(200).json(results[0]);
    } catch (err) {
        next(err);
    }
};

const searchUsers = async (req, res, next) => {
    const searchTerm = req.query.userName;
    if (!searchTerm) {
        return next(new BadRequestError("Vui lòng cung cấp từ khóa tìm kiếm"));
    }
    const sql = `SELECT user_id,
                    user_name,
                    email,
                    role_id,
                    created_at,
                    TRIM(status) as status,
                    avatar_url
                FROM users
                WHERE role_id=4 AND user_name LIKE ?
                ORDER BY created_at DESC`;
    const searchPattern = `%${searchTerm}%`;
    try {
        const [results] = await db.query(sql, [searchPattern]);
        if (results.length === 0) {
            return next(new NotFoundError("Không tìm thấy người dùng phù hợp."));
        }
        res.status(200).json(results);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUserStatus,
    searchUsers
};