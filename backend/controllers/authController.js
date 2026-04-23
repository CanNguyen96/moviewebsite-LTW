const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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
                    const token = jwt.sign(user, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '3h' });

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
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '3h' }
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
    let avatar_url = null;
    
    if (req.file) {
        avatar_url = `/images/${req.file.filename}`;
    }

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
                        if (avatar_url) {
                            updateFields.push('avatar_url = ?');
                            updateValues.push(avatar_url);
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
                            
                            const finalAvatarUrl = avatar_url || req.user.avatar_url;
                            const updatedUser = { user_id, user_name: user_name || req.user.user_name, email: req.user.email, avatar_url: finalAvatarUrl, role_id: req.user.role_id };
                            const newToken = jwt.sign(updatedUser, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '3h' });
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
                    if (avatar_url) {
                        updateFields.push('avatar_url = ?');
                        updateValues.push(avatar_url);
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
                        
                        const finalAvatarUrl = avatar_url || req.user.avatar_url;
                        const updatedUser = { user_id, user_name: user_name || req.user.user_name, email: req.user.email, avatar_url: finalAvatarUrl, role_id: req.user.role_id };
                        const newToken = jwt.sign(updatedUser, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '3h' });
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

// API: Đăng nhập bằng Google
const googleLogin = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (result.length > 0) {
                // User exists
                const user = result[0];
                if (user.status === 'Banned') {
                    return res.status(403).json({ error: 'Tài khoản của bạn đã bị cấm.' });
                }

                const jwtToken = jwt.sign(
                    { user_id: user.user_id, user_name: user.user_name, email: user.email },
                    process.env.JWT_SECRET || 'your_secret_key',
                    { expiresIn: '3h' }
                );

                res.json({
                    message: 'Đăng nhập thành công!',
                    token: jwtToken,
                    user: { user_id: user.user_id, user_name: user.user_name, email: user.email, role_id: user.role_id }
                });
            } else {
                // Create new user
                const randomPassword = crypto.randomBytes(16).toString('hex');
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);
                
                const uniqueUserName = name.replace(/\s+/g, '') + Math.floor(1000 + Math.random() * 9000);

                db.query(
                    'INSERT INTO users (user_name, email, password, role_id) VALUES (?, ?, ?, ?)',
                    [uniqueUserName, email, hashedPassword, 4],
                    (err, insertResult) => {
                        if (err) {
                            console.log('Lỗi khi thêm user từ Google:', err);
                            return res.status(500).json({ error: err.message });
                        }
                        
                        const newUser = { user_id: insertResult.insertId, user_name: uniqueUserName, email };
                        const jwtToken = jwt.sign(newUser, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '3h' });

                        res.status(201).json({
                            message: 'Đăng nhập thành công!',
                            token: jwtToken,
                            user: { ...newUser, role_id: 4 }
                        });
                    }
                );
            }
        });
    } catch (err) {
        console.log('Lỗi xác thực Google:', err);
        res.status(401).json({ error: 'Xác thực Google thất bại' });
    }
};

module.exports = {
    register,
    login,
    updateUser,
    forgotPassword,
    googleLogin
};