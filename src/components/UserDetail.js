import styles from '../styles/UserDetail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserDetail(){   
    const {userId}= useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading]= useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm lấy thông tin user
    const fetchUser = useCallback(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Không thể tải thông tin người dùng!');
                }
                return res.json();
            })
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
        fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Không thể cập nhật trạng thái!');
                }
                return res.json();
            })
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


    if (loading) return <div>Đang tải...</div>;
    if(error) return <div>Lỗi:{error}</div>
    if (!user) {
        return <div>Không tìm thấy thông tin người dùng.</div>;
    }

    const normalizedStatus = (user.status || '').trim().toLowerCase();
    const isActive = normalizedStatus === 'active';

    return(
        <div className={styles['user-detail']}>
            <ToastContainer />
            <div className={styles.tag}>
                <h3>Quản lí tài khoản</h3>
            </div>
            <div className={styles.avatar}>
                <li><FontAwesomeIcon icon={faUserCircle} size="3x" /></li>
            </div>
            <div className={styles.infor}>
                <ul>
                    <li><strong>Id tài khoản: </strong> {user.user_id}</li>
                    <li><strong>Tên tài khoản: </strong> {user.user_name}</li>
                    <li><strong>Email: </strong>{user.email}</li>
                    <li><strong>Vai trò: </strong>{Number(user.role_id) === 1 ? 'Admin' : 'User'}</li>
                    <li><strong>Ngày tạo tài khoản: </strong>{new Date(user.created_at).toLocaleDateString('vi-VN')}</li>
                    <li><strong>Trạng thái tài khoản: </strong>{isActive ? 'Active' : 'Banned'}</li>
                </ul>
            </div>
            <div className={styles.actions}>
                <button className={styles.ban} onClick={()=> updateStatus('Banned')}  disabled={!isActive}>Banned</button>
                <button className={styles.active} onClick={()=> updateStatus('Active')} disabled={isActive}>Active</button>
            </div>

        </div>
    )
}
export default UserDetail;

