const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const { sendMail } = require('../config/mailer');
const { getFileUrl } = require('../middlewares/upload');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Bộ nhớ tạm để lưu OTP (Trong môi trường thực tế nên dùng Redis)
const otpStore = {};

// Hàm tạo OTP ngẫu nhiên 6 số
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hàm kiểm tra độ mạnh mật khẩu
const validatePassword = (password) => {
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!/\d/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ số (0-9)';
    if (!/[!@#$%^&*()[\]{}|<>?~=_+-]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
    return null; // Mật khẩu hợp lệ
};


// API: Gửi OTP Đăng ký
const sendRegisterOtp = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Vui lòng điền tên và email' });

    try {
        db.query('SELECT * FROM users WHERE email = ? OR user_name = ?', [email, name], async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length > 0) {
                const emailExists = result.some(u => u.email.toLowerCase() === email.toLowerCase());
                const nameExists = result.some(u => u.user_name.toLowerCase() === name.toLowerCase());

                if (emailExists) return res.status(400).json({ error: 'Email đã được sử dụng' });
                if (nameExists) return res.status(400).json({ error: 'Tên người dùng đã tồn tại' });

                return res.status(400).json({ error: 'Tài khoản đã tồn tại' });
            }

            const otp = generateOTP();
            otpStore[email] = { otp, type: 'REGISTER', expiresAt: Date.now() + 5 * 60 * 1000 }; // Hết hạn sau 5 phút

            // Trả lời ngay cho client, gửi email ở background
            res.json({ message: 'Mã OTP đã được gửi đến email của bạn!' });

            // Giao diện Email OTP chuẩn Production (Đăng ký)
            const htmlContent = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f5f6; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="background-color: #e50914; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Anime69</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #333; margin-top: 0;">Chào mừng bạn đến với Anime69!</h2>
                        <p style="color: #555; font-size: 16px; line-height: 1.5;">
                            Chào <strong>${name}</strong>,<br>
                            Cảm ơn bạn đã đăng ký tài khoản. Để hoàn thiện quá trình đăng ký và bắt đầu khám phá thế giới anime, vui lòng sử dụng mã OTP dưới đây để xác thực:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="display: inline-block; background-color: #f8f9fa; padding: 15px 30px; font-size: 32px; font-weight: bold; color: #e50914; letter-spacing: 5px; border-radius: 5px; border: 1px dashed #ccc;">
                                ${otp}
                            </span>
                        </div>
                        <p style="color: #777; font-size: 14px;">
                            Lưu ý: Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.
                        </p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            © 2026 Anime69 System. Đã đăng ký bản quyền.
                        </p>
                    </div>
                </div>
            </div>
            `;

            // Gửi email bất đồng bộ (không block response)
            sendMail(
                email,
                'Kích hoạt tài khoản — Anime69',
                htmlContent
            ).catch(err => console.error('Background email error:', err));
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
};

// API: Đăng ký người dùng
const register = async (req, res) => {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin và mã OTP' });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }

    // Kiểm tra OTP
    const storedOtpData = otpStore[email];
    if (!storedOtpData || storedOtpData.type !== 'REGISTER') {
        return res.status(400).json({ error: 'Không tìm thấy mã OTP cho email này' });
    }
    if (Date.now() > storedOtpData.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ error: 'Mã OTP đã hết hạn, vui lòng gửi lại' });
    }
    if (storedOtpData.otp !== otp) {
        return res.status(400).json({ error: 'Mã OTP không chính xác' });
    }

    try {
        db.query('SELECT * FROM users WHERE email = ? OR user_name = ?', [email, name], async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length > 0) {
                const emailExists = result.some(u => u.email.toLowerCase() === email.toLowerCase());
                const nameExists = result.some(u => u.user_name.toLowerCase() === name.toLowerCase());
                if (emailExists) return res.status(400).json({ error: 'Email đã được sử dụng' });
                if (nameExists) return res.status(400).json({ error: 'Tên người dùng đã tồn tại' });
                return res.status(400).json({ error: 'Tài khoản đã tồn tại' });
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
                    const user = { user_id: result.insertId, user_name: name, email, role_id: 4, avatar_url: null };
                    const token = jwt.sign(user, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '3h' });

                    delete otpStore[email]; // Xóa OTP sau khi dùng thành công

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
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        if (user.status === 'Banned') {
            return res.status(403).json({ error: 'Tài khoản của bạn đã bị cấm.' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, user_name: user.user_name, email: user.email, role_id: user.role_id, avatar_url: user.avatar_url },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '3h' }
        );

        res.json({
            message: 'Đăng nhập thành công!',
            token,
            user: { user_id: user.user_id, user_name: user.user_name, email: user.email, role_id: user.role_id, avatar_url: user.avatar_url }
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
        avatar_url = getFileUrl(req.file);
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

                    const passwordError = validatePassword(password);
                    if (passwordError) {
                        return res.status(400).json({ error: passwordError });
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

// API: Gửi OTP Quên mật khẩu
const sendForgotOtp = async (req, res) => {
    const { user_name, email } = req.body;
    if (!user_name || !email) return res.status(400).json({ error: 'Vui lòng điền tên và email' });

    db.query('SELECT * FROM users WHERE user_name = ? AND email = ?', [user_name, email], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Không tìm thấy tài khoản với thông tin này' });

        const otp = generateOTP();
        otpStore[email] = { otp, type: 'FORGOT', expiresAt: Date.now() + 5 * 60 * 1000 };

        // Trả lời ngay cho client, gửi email ở background
        res.json({ message: 'Mã OTP đã được gửi đến email của bạn!' });

        // Giao diện Email OTP chuẩn Production (Khôi phục mật khẩu)
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f5f6; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="background-color: #111; padding: 20px; text-align: center;">
                    <h1 style="color: #e50914; margin: 0; font-size: 28px;">Anime69</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #333; margin-top: 0;">Khôi phục mật khẩu</h2>
                    <p style="color: #555; font-size: 16px; line-height: 1.5;">
                        Chào <strong>${user_name}</strong>,<br>
                        Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản liên kết với email này. Dưới đây là mã xác thực OTP của bạn:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; background-color: #f8f9fa; padding: 15px 30px; font-size: 32px; font-weight: bold; color: #111; letter-spacing: 5px; border-radius: 5px; border: 1px solid #333;">
                            ${otp}
                        </span>
                    </div>
                    <p style="color: #777; font-size: 14px;">
                        Lưu ý: Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>. Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này để bảo vệ tài khoản.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2026 Anime69 System. Bộ phận bảo mật.
                    </p>
                </div>
            </div>
        </div>
        `;

        // Gửi email bất đồng bộ (không block response)
        sendMail(
            email,
            'Yêu cầu Khôi phục Mật khẩu — Anime69',
            htmlContent
        ).catch(err => console.error('Background email error:', err));
    });
};

// API: Quên mật khẩu
const forgotPassword = (req, res) => {
    const { user_name, email, otp, new_password } = req.body;

    if (!user_name || !email || !otp || !new_password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin (tên, email, OTP, mật khẩu mới)' });
    }

    const passwordError = validatePassword(new_password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }

    // Kiểm tra OTP
    const storedOtpData = otpStore[email];
    if (!storedOtpData || storedOtpData.type !== 'FORGOT') {
        return res.status(400).json({ error: 'Không tìm thấy mã OTP cho email này' });
    }
    if (Date.now() > storedOtpData.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ error: 'Mã OTP đã hết hạn, vui lòng gửi lại' });
    }
    if (storedOtpData.otp !== otp) {
        return res.status(400).json({ error: 'Mã OTP không chính xác' });
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

                delete otpStore[email]; // Xóa OTP sau khi dùng

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
                    { user_id: user.user_id, user_name: user.user_name, email: user.email, role_id: user.role_id, avatar_url: user.avatar_url },
                    process.env.JWT_SECRET || 'your_secret_key',
                    { expiresIn: '3h' }
                );

                res.json({
                    message: 'Đăng nhập thành công!',
                    token: jwtToken,
                    user: { user_id: user.user_id, user_name: user.user_name, email: user.email, role_id: user.role_id, avatar_url: user.avatar_url }
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

                        const newUser = { user_id: insertResult.insertId, user_name: uniqueUserName, email, role_id: 4, avatar_url: null };
                        const jwtToken = jwt.sign(newUser, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '3h' });

                        res.status(201).json({
                            message: 'Đăng nhập thành công!',
                            token: jwtToken,
                            user: newUser
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
    sendRegisterOtp,
    register,
    login,
    updateUser,
    sendForgotOtp,
    forgotPassword,
    googleLogin
};