"use client";
import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await authService.login(email, password);
    
            if (!data.user) {
                throw new Error("Dữ liệu người dùng không hợp lệ từ API /login");
            }
    
            // Lưu token và user vào localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
    
            toast.success("Đăng nhập thành công!", {
                position: "top-right",
                autoClose: 2000,
            });
    
            window.dispatchEvent(new Event("userChanged"));
    
            setTimeout(() => {
                if (data.user.role_id === 1) {
                    navigate("/manageuser"); 
                } else {
                    navigate("/");
                }
            }, 2000);
        } catch (err) {
            console.error("Lỗi khi đăng nhập:", err);
            setError(err.response?.data?.error || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError("");
        try {
            const data = await authService.googleLogin(credentialResponse.credential);

            if (!data.user) {
                throw new Error("Dữ liệu người dùng không hợp lệ từ API");
            }

            // Lưu token và user vào localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            toast.success("Đăng nhập bằng Google thành công!", {
                position: "top-right",
                autoClose: 2000,
            });

            window.dispatchEvent(new Event("userChanged"));

            setTimeout(() => {
                if (data.user.role_id === 1) {
                    navigate("/manageuser"); 
                } else {
                    navigate("/");
                }
            }, 2000);
        } catch (err) {
            console.error("Lỗi khi đăng nhập bằng Google:", err);
            setError(err.response?.data?.error || "Đăng nhập bằng Google thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <h2>Đăng Nhập</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <Link to="/forgot-password" className={styles.forgot}>
                    Quên mật khẩu?
                </Link>
                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đăng Nhập"}
                </button>
                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError("Đăng nhập Google thất bại")}
                    />
                </div>
            </form>
            <p>
                Chưa có tài khoản?{" "}
                <Link to="/register" className={styles['register-link']}>
                    Đăng kí
                </Link>
            </p>
        </div>
    );
}

export default LoginForm;