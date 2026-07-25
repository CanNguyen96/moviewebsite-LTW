const db = require('../config/db');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// API: Lấy danh sách tài khoản người dùng
const getUsers = (req, res, next) => {
    const sql = `SELECT user_id, user_name, email, role_id, created_at, TRIM(status) AS status, avatar_url
                FROM users
                WHERE role_id=4
                ORDER BY created_at DESC
                `;
  
    db.query(sql, (err, results) => {
        if (err) return next(err);
        res.status(200).json(results);
    });
};

// Lấy thông tin tài khoàn người dùng theo ID
const getUserById = (req, res, next) => {
    const userId = req.params.user_id;
    const sql = 'SELECT user_id, user_name, email, role_id, created_at, status, avatar_url FROM users WHERE user_id = ?';

    db.query(sql, [userId], (err, result) => {
        if (err) return next(err);
        if(result.length === 0) {
            return next(new NotFoundError('Không tìm thấy user'));
        }
        res.status(200).json(result[0]);
    });
};

// API: Cập nhật trạng thái người dùng ( Active or Banned )
const updateUserStatus = (req, res, next) => {
    const userId = req.params.user_id;
    const {status} = req.body;
    
    if(!status || (status !== 'Active' && status !== 'Banned')) {
        return next(new BadRequestError('Status không hợp lệ'));
    }

    const sql = 'UPDATE users SET status = ? WHERE user_id = ?';
    db.query(sql, [status, userId], (err, result) => {
        if (err) return next(err);
        
        const getUserSql = 'SELECT user_id, user_name, email, role_id, created_at, TRIM(status) AS status, avatar_url FROM users WHERE user_id = ?';
        db.query(getUserSql, [userId], (err, results) => {
            if (err) return next(err);
            if (results.length === 0) {
                return next(new NotFoundError('Không tìm thấy user'));
            }
            res.status(200).json(results[0]);
        });
    });
};
const searchUsers= (req, res, next)=>{
    const searchTerm= req.query.userName;
    if (!searchTerm){
        return next(new BadRequestError("Vui lòng cung cấp từ khóa tìm kiếm"));
    }
    const sql=`SELECT user_id,
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
    db.query(sql, [searchPattern], (err,results) =>{
        if (err) return next(err);
        if (results.length===0){
            return next(new NotFoundError("Không tìm thấy người dùng phù hợp."));
        }
        res.status(200).json(results);
    });
    
}

module.exports = {
    getUsers,
    getUserById,
    updateUserStatus,
    searchUsers
};