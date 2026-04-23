import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import styles from '../styles/HeaderAdmin.module.css';
import logo_web from "../picture/logo-1.webp";
import { useAuth } from '../contexts/AuthContext';

function HeaderAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const { logout } = useAuth();
    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    // Hàm xử lý thay đổi trong ô tìm kiếm
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Hàm xử lý gửi yêu cầu tìm kiếm (ví dụ: khi nhấn Enter)
    const handleSearchSubmit = (event) => {
        if (event.key === 'Enter' && searchTerm.trim() !== '') {
            const currentPath = location.pathname;
            const trimmedSearchTerm = searchTerm.trim();

            if (currentPath.includes('/manageuser') || currentPath.includes('/admin/search-users')) {
                navigate(`/admin/search-users?userName=${encodeURIComponent(trimmedSearchTerm)}`);
            } else if (currentPath.includes('/managemovie') || currentPath.includes('/admin/search-movies')
                || currentPath.includes('/admin/episodes') || currentPath.includes('/admin/edit') || currentPath.includes('/admin/add')) {
                navigate(`/admin/search-movies?movieName=${encodeURIComponent(trimmedSearchTerm)}`);
            }
            setSearchTerm('');
        }
    };
    const getPlaceHolder = () => {
        const currentPath = location.pathname;
        if (currentPath.includes('/manageuser') || currentPath.includes('/admin/search-users')) {
            return "Tìm kiếm người dùng"
        } else if (currentPath.includes('/managemovie') || currentPath.includes('/admin/search-movies')
            || currentPath.includes('/admin/episodes') || currentPath.includes('/admin/edit') || currentPath.includes('/admin/add')) {
            return "Tìm kiếm phim"
        }
        return "Tìm kiếm"
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <Link to="/manageuser">
                    <img src={logo_web} alt="Logo" />
                </Link>
            </div>
            <div className={styles.header}>
                <ul>
                    <li><Link to="/manageuser">QUẢN LÝ TÀI KHOẢN</Link></li>
                    <li><Link to="/managemovie">QUẢN LÝ PHIM</Link></li>
                </ul>
            </div>
            <div className={styles.search}>
                <ul>
                    <li>
                        <input
                            placeholder={getPlaceHolder()}
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchSubmit}
                        />
                    </li>
                </ul>
            </div>
            <div className={styles['user-infor']}>
                <ul>
                    <li>Admin</li>
                    <button onClick={handleLogout} className={styles['button-logout']} >
                        Đăng Xuất
                    </button>
                </ul>
            </div>
        </nav>
    );
}

export default HeaderAdmin;