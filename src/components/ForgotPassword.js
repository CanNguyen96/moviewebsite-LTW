
import { useState } from "react";
import styles from "../styles/Login.module.css";
import { authService } from "../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Nhập Info, 2: Nhập OTP & MK Mới
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await authService.sendForgotOtp(userName, email);
            toast.success(data.message, { autoClose: 2000 });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại");
            toast.error(err.response?.data?.error || "Lỗi", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await authService.forgotPassword(userName, email, otp, newPassword);

            toast.success(data.message, { autoClose: 2000 });

            setUserName("");
            setEmail("");
            setNewPassword("");
            setOtp("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại");
            toast.error(err.response?.data?.error || "Lỗi", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <h2>Quên Mật Khẩu</h2>
            {step === 1 ? (
                <form className={styles.form} onSubmit={handleSendOtp}>
                    <label>Tên Người Dùng</label>
                    <input
                        type="text"
                        placeholder="Nhập tên người dùng"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Nhận Mã Khôi Phục"}
                    </button>
                    <button 
                        type="button" 
                        className={styles.btn} 
                        style={{marginTop: '10px', backgroundColor: '#555'}}
                        onClick={() => navigate("/login")} 
                        disabled={loading}
                    >
                        Quay lại Đăng Nhập
                    </button>
                </form>
            ) : (
                <form className={styles.form} onSubmit={handleForgotPasswordSubmit}>
                    <p style={{textAlign: "center", marginBottom: "15px"}}>
                        Mã OTP khôi phục đã được gửi đến <b>{email}</b>.<br/>
                    </p>
                    <label>Mã OTP (6 số)</label>
                    <input
                        type="text"
                        placeholder="Nhập mã OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <label>Mật Khẩu Mới</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Cập Nhật Mật Khẩu"}
                    </button>
                    <button 
                        type="button" 
                        className={styles.btn} 
                        style={{marginTop: '10px', backgroundColor: '#555'}}
                        onClick={() => setStep(1)} 
                        disabled={loading}
                    >
                        Quay lại
                    </button>
                </form>
            )}
        </div>
    );
}

export default ForgotPassword;