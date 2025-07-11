const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// API: Đăng ký người dùng
const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        db.query('SELECT * FROM users WHERE email = ? OR user_name = ?', [email, name], async (err, result) => {
            if (err) {
                console.log('Lỗi kiểm tra email/user_name:', err);
                return res.status(500).json({ error: err.message });
            }
            if (result.length > 0) {
                const existingUser = result[0];
                if (existingUser.email === email) {
                    return res.status(400).json({ error: 'Email đã được sử dụng' });
                }
                if (existingUser.user_name === name) {
                    return res.status(400).json({ error: 'Tên người dùng đã được sử dụng' });
                }
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            db.query(
                'INSERT INTO users (user_name, email, password, role_id) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, 4],
                (err, result) => {
                    if (err) {
                        console.log('Lỗi khi thêm user:', err);
                        return res.status(500).json({ error: err.message });
                    }
                    const user = { user_id: result.insertId, user_name: name, email };
                    const token = jwt.sign(user, 'your_secret_key', { expiresIn: '1h' });

                    res.status(201).json({
                        message: 'Đăng ký thành công!',
                        token,
                        user
                    });
                }
            );
        });
    } catch (err) {
        console.log('Lỗi server:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

// API: Đăng nhập người dùng
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Mật khẩu không đúng' });
        }

        if (user.status === 'Banned') {
            return res.status(403).json({ error: 'Tài khoản của bạn đã bị cấm.' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, user_name: user.user_name, email: user.email },
            'your_secret_key',
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Đăng nhập thành công!',
            token,
            user: { user_id: user.user_id, user_name: user.user_name, email: user.email, role_id: user.role_id }
        });
    });
};

// API: Cập nhật thông tin người dùng (yêu cầu đăng nhập)
const updateUser = async (req, res) => {
    if (!req.user || !req.user.user_id) {
        return res.status(401).json({ error: 'Không thể xác thực người dùng, vui lòng đăng nhập lại' });
    }

    const { user_name, oldPassword, password } = req.body;
    const user_id = req.user.user_id;

    try {
        // Kiểm tra user_name đã tồn tại
        db.query(
            'SELECT * FROM users WHERE user_name = ? AND user_id != ?',
            [user_name, user_id],
            async (err, result) => {
                if (err) {
                    console.log('Lỗi kiểm tra user_name:', err);
                    return res.status(500).json({ error: err.message });
                }
                if (result.length > 0) {
                    return res.status(400).json({ error: 'Tên người dùng đã được sử dụng' });
                }

                // Nếu người dùng nhập mật khẩu cũ, yêu cầu mật khẩu mới không được trống
                if (oldPassword) {
                    if (!password) {
                        return res.status(400).json({ error: 'Vui lòng nhập mật khẩu mới' });
                    }

                    // Lấy mật khẩu hiện tại từ database
                    db.query('SELECT password FROM users WHERE user_id = ?', [user_id], async (err, result) => {
                        if (err) {
                            console.log('Lỗi khi lấy mật khẩu:', err);
                            return res.status(500).json({ error: err.message });
                        }
                        if (result.length === 0) {
                            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
                        }

                        const currentPassword = result[0].password;
                        const match = await bcrypt.compare(oldPassword, currentPassword);
                        if (!match) {
                            return res.status(401).json({ error: 'Mật khẩu cũ không đúng' });
                        }

                        // Nếu mật khẩu cũ đúng, mã hóa mật khẩu mới
                        const saltRounds = 10;
                        const hashedPassword = await bcrypt.hash(password, saltRounds);

                        // Tiến hành cập nhật thông tin
                        const updateFields = [];
                        const updateValues = [];

                        if (user_name) {
                            updateFields.push('user_name = ?');
                            updateValues.push(user_name);
                        }
                        if (hashedPassword) {
                            updateFields.push('password = ?');
                            updateValues.push(hashedPassword);
                        }

                        if (updateFields.length === 0) {
                            return res.status(400).json({ error: 'Không có thông tin nào để cập nhật' });
                        }

                        updateValues.push(user_id);
                        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;

                        db.query(query, updateValues, (err, result) => {
                            if (err) {
                                console.log('Lỗi khi cập nhật user:', err);
                                return res.status(500).json({ error: err.message });
                            }
                            const updatedUser = { user_id, user_name: user_name || req.user.user_name, email: req.user.email };
                            const newToken = jwt.sign(updatedUser, 'your_secret_key', { expiresIn: '1h' });
                            res.json({
                                message: 'Cập nhật thông tin thành công!',
                                token: newToken,
                                user: updatedUser
                            });
                        });
                    });
                } else if (!oldPassword && password) {
                    // Nếu chỉ nhập mật khẩu mới mà không nhập mật khẩu cũ
                    return res.status(400).json({ error: 'Vui lòng nhập mật khẩu cũ' });
                } else {
                    // Nếu không nhập mật khẩu cũ và mật khẩu mới, chỉ cập nhật user_name
                    const updateFields = [];
                    const updateValues = [];

                    if (user_name) {
                        updateFields.push('user_name = ?');
                        updateValues.push(user_name);
                    }

                    if (updateFields.length === 0) {
                        return res.status(400).json({ error: 'Không có thông tin nào để cập nhật' });
                    }

                    updateValues.push(user_id);
                    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;

                    db.query(query, updateValues, (err, result) => {
                        if (err) {
                            console.log('Lỗi khi cập nhật user:', err);
                            return res.status(500).json({ error: err.message });
                        }
                        const updatedUser = { user_id, user_name: user_name || req.user.user_name, email: req.user.email };
                        const newToken = jwt.sign(updatedUser, 'your_secret_key', { expiresIn: '1h' });
                        res.json({
                            message: 'Cập nhật thông tin thành công!',
                            token: newToken,
                            user: updatedUser
                        });
                    });
                }
            }
        );
    } catch (err) {
        console.log('Lỗi server:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

// API: Quên mật khẩu
const forgotPassword = (req, res) => {
    const { user_name, email, new_password } = req.body;

    if (!user_name || !email || !new_password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin (tên, email, mật khẩu mới)' });
    }

    db.query('SELECT * FROM users WHERE user_name = ? AND email = ?', [user_name, email], async (err, result) => {
        if (err) {
            console.log('Lỗi kiểm tra user_name và email:', err);
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng với thông tin đã cung cấp' });
        }

        const user = result[0];
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        db.query(
            'UPDATE users SET password = ? WHERE user_id = ?',
            [hashedPassword, user.user_id],
            (err, result) => {
                if (err) {
                    console.log('Lỗi khi cập nhật mật khẩu:', err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({
                    message: 'Mật khẩu đã được cập nhật thành công!',
                    user: { user_id: user.user_id, user_name: user.user_name, email: user.email }
                });
            }
        );
    });
};

module.exports = {
    register,
    login,
    updateUser,
    forgotPassword
};