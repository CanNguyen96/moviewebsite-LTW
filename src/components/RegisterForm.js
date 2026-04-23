
import { useState } from "react";
import styles from "../styles/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext";

function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Info, 2: OTP
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const data = await authService.sendRegisterOtp(name, email);
            toast.success(data.message);
            setStep(2); // Chuyển sang bước nhập OTP
        } catch (err) {
            console.error("Lỗi khi gửi OTP:", err);
            setError(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await authService.register(name, email, password, otp);
            if (!data.user) throw new Error("Dữ liệu người dùng không hợp lệ từ API /register");
            
            login(data.user, data.token);
            toast.success(data.message, { autoClose: 2000 });
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error("Lỗi khi đăng ký:", err);
            setError(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <h2>Đăng Ký</h2>
            {step === 1 ? (
                <form className={styles.form} onSubmit={handleSendOtp}>
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
                        {loading ? "Đang xử lý..." : "Tiếp tục (Nhận mã OTP)"}
                    </button>
                </form>
            ) : (
                <form className={styles.form} onSubmit={handleRegister}>
                    <p style={{textAlign: "center", marginBottom: "15px"}}>
                        Mã OTP đã được gửi đến <b>{email}</b>.<br/>
                        Vui lòng kiểm tra hộp thư đến (hoặc thư rác).
                    </p>
                    <label>Mã OTP (6 số)</label>
                    <input
                        type="text"
                        placeholder="Nhập mã OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Xác nhận Đăng Ký"}
                    </button>
                    <button type="button" className={styles.btn} style={{marginTop: '10px', backgroundColor: '#555'}} onClick={() => setStep(1)} disabled={loading}>
                        Quay lại
                    </button>
                </form>
            )}
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