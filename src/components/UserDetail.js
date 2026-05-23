import styles from '../styles/UserDetail.module.css';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userService } from '../services/userService';
import { getAvatarSrc } from '../utils/image';
import { 
    FaIdCard, 
    FaUser, 
    FaEnvelope, 
    FaShieldAlt, 
    FaCalendarAlt, 
    FaToggleOn, 
    FaArrowLeft, 
    FaBan, 
    FaCheckSquare 
} from 'react-icons/fa';

function UserDetail(){   
    const {userId}= useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading]= useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm lấy thông tin user
    const fetchUser = useCallback(() => {
        userService.getUserById(userId)
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Lỗi lấy thông tin user:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [userId]);

    useEffect(()=>{
        fetchUser();
    }, [fetchUser]);

    // Hàm cập nhật trạng thái
    const updateStatus = (newStatus) => {
        userService.updateUserStatus(userId, newStatus)
            .then((data) => {
                setUser(data);
                toast.success('Cập nhật trạng thái thành công!'); 
                setTimeout(() => navigate(-1), 1500);
            })
            .catch((err) => {
                console.error('Lỗi cập nhật trạng thái:', err);
                toast.error('Lỗi cập nhật trạng thái: ' + err.message);
            });
    };

    if (loading) {
        return (
            <div className={styles['page-container']}>
                <div className={styles['loading-box']}>Đang tải...</div>
            </div>
        );
    }
    if (error) {
        return (
            <div className={styles['page-container']}>
                <div className={styles['error-box']}>Lỗi: {error}</div>
            </div>
        );
    }
    if (!user) {
        return (
            <div className={styles['page-container']}>
                <div className={styles['error-box']}>Không tìm thấy thông tin người dùng.</div>
            </div>
        );
    }

    const normalizedStatus = (user.status || '').trim().toLowerCase();
    const isActive = normalizedStatus === 'active';

    // Xử lý avatar: Nếu không có avatar_url thì lấy từ ui-avatars.com theo tên với background đỏ
    const avatarUrl = user.avatar_url 
        ? getAvatarSrc(user.avatar_url) 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_name)}&background=ff3d47&color=fff&size=150&bold=true`;

    return(
        <div className={styles['page-container']}>
            <ToastContainer theme="dark" />
            <div className={`${styles['user-detail']} ${isActive ? styles['card-active'] : styles['card-banned']}`}>
                <button className={styles['back-btn']} onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Quay lại
                </button>
                <div className={styles.tag}>
                    <h3>Quản lí tài khoản</h3>
                </div>
                <div className={styles.avatar}>
                    <img 
                        src={avatarUrl} 
                        alt={user.user_name} 
                        className={styles['avatar-img']} 
                        onError={(e) => { 
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_name)}&background=ff3d47&color=fff&size=150&bold=true`;
                        }} 
                    />
                </div>
                <div className={styles.infor}>
                    <ul>
                        <li>
                            <span className={styles['label-group']}>
                                <FaIdCard className={styles.icon} />
                                <strong>Id tài khoản:</strong>
                            </span>
                            <span className={styles['info-value-text']}>{user.user_id}</span>
                        </li>
                        <li>
                            <span className={styles['label-group']}>
                                <FaUser className={styles.icon} />
                                <strong>Tên tài khoản:</strong>
                            </span>
                            <span className={styles['info-value-text']}>{user.user_name}</span>
                        </li>
                        <li>
                            <span className={styles['label-group']}>
                                <FaEnvelope className={styles.icon} />
                                <strong>Email:</strong>
                            </span>
                            <span className={styles['info-value-text']}>{user.email}</span>
                        </li>
                        <li>
                            <span className={styles['label-group']}>
                                <FaShieldAlt className={styles.icon} />
                                <strong>Vai trò:</strong>
                            </span>
                            <span className={Number(user.role_id) === 1 ? styles['role-admin'] : styles['role-user']}>
                                {Number(user.role_id) === 1 ? 'Admin' : 'User'}
                            </span>
                        </li>
                        <li>
                            <span className={styles['label-group']}>
                                <FaCalendarAlt className={styles.icon} />
                                <strong>Ngày tạo:</strong>
                            </span>
                            <span className={styles['info-value-text']}>{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                        </li>
                        <li>
                            <span className={styles['label-group']}>
                                <FaToggleOn className={styles.icon} />
                                <strong>Trạng thái:</strong>
                            </span>
                            <span className={isActive ? styles['status-active'] : styles['status-banned']}>
                                {isActive ? 'Active' : 'Banned'}
                            </span>
                        </li>
                    </ul>
                </div>
                <div className={styles.actions}>
                    <button 
                        className={styles.ban} 
                        onClick={() => updateStatus('Banned')}  
                        disabled={!isActive}
                    >
                        <FaBan /> Banned
                    </button>
                    <button 
                        className={styles['active-btn']} 
                        onClick={() => updateStatus('Active')} 
                        disabled={isActive}
                    >
                        <FaCheckSquare /> Active
                    </button>
                </div>
            </div>
        </div>
    )
}
export default UserDetail;

