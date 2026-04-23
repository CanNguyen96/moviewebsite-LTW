
import { useState } from "react";
import styles from "../styles/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const data = await authService.register(name, email, password);
            // Kiểm tra dữ liệu từ API
            if (!data.user) {
                throw new Error("Dữ liệu người dùng không hợp lệ từ API /register");
            }
            // Lưu token và thông tin user vào localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success(data.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // Gửi sự kiện để thông báo rằng user đã thay đổi
            window.dispatchEvent(new Event("userChanged"));
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error("Lỗi khi đăng ký:", err);
            const errorMessage =
                err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <h2>Đăng Ký</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label>Họ và Tên</label>
                <input
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <label>Xác nhận mật khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đăng Ký"}
                </button>
            </form>
            <p>
                Đã có tài khoản?{" "}
                <Link to="/login" className={styles['register-link']}>
                    Đăng nhập
                </Link>
            </p>
        </div>
    );
}

export default RegisterForm;