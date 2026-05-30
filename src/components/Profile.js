"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Profile.module.css";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext";
import { getAvatarSrc } from "../utils/image";
import { validatePassword } from "../validators/authValidator";
import { validateUserName } from "../validators/profileValidator";
import PasswordInput from "./PasswordInput";

function Profile() {
    const { user, updateUser } = useAuth();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("/images/default-avatar.png");
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUserName(user.user_name);
            setEmail(user.email);
            if (user.avatar_url) {
                setAvatarPreview(user.avatar_url);
            }
        } else {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate userName
        const userNameError = validateUserName(userName);
        if (userNameError) {
            toast.error(userNameError, { position: "top-right", autoClose: 2000 });
            return;
        }

        if (password) {
            const passwordError = validatePassword(password);
            if (passwordError) {
                toast.error(passwordError, {
                    position: "top-right",
                    autoClose: 2000,
                });
                return;
            }
        }

        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để tiếp tục!");
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("user_name", userName);
        if (oldPassword) formData.append("oldPassword", oldPassword);
        if (password) formData.append("password", password);
        if (avatarFile) formData.append("avatar", avatarFile);

        try {
            const data = await userService.updateProfile(formData);
            localStorage.setItem("token", data.token);
            updateUser(data.user);
            setUserName(data.user.user_name);
            if (data.user.avatar_url) {
                setAvatarPreview(data.user.avatar_url);
            }
            setOldPassword("");
            setPassword("");
            toast.success("Cập nhật thông tin thành công!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (err) {
            setError(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Đang tải...</div>;

    return (
        <div className={styles.container}>
            <ToastContainer />
            <h2>Quản Lý Tài Khoản</h2>

            <div className={styles['avatar-section']}>
                <div className={styles['avatar-wrapper']} onClick={handleAvatarClick}>
                    <img
                        src={getAvatarSrc(avatarPreview)}
                        alt="Avatar"
                        className={styles['avatar-img']}
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + userName + '&background=random' }}
                    />
                    <div className={styles['avatar-overlay']}>
                        <span className={styles['overlay-text']}>Đổi Ảnh</span>
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className={styles['file-input']}
                    onChange={handleAvatarChange}
                />
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label>Tên người dùng</label>
                <input
                    type="text"
                    placeholder="Nhập tên người dùng"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    disabled
                />
                <label htmlFor="profile-old-password">Mật khẩu cũ</label>
                <PasswordInput
                    id="profile-old-password"
                    placeholder="Nhập mật khẩu cũ (nếu muốn đổi)"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={styles['form-password']}
                />
                <label htmlFor="profile-new-password">Mật khẩu mới</label>
                <PasswordInput
                    id="profile-new-password"
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles['form-password']}
                />
                {error && <p className={styles['error-message']}>{error}</p>}
                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Cập Nhật"}
                </button>
            </form>
        </div>
    );
}

export default Profile;