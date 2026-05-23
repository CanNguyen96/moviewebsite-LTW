"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo_web from "../picture/logo-1.webp";
import { movieService } from "../services/movieService";
import { useAuth } from "../contexts/AuthContext";
import { FaHeart, FaHistory, FaUserCog, FaSignOutAlt, FaSearch } from "react-icons/fa";

const getAvatarSrc = (avatar) => {
  if (!avatar) return "/images/default-avatar.png";
  if (avatar.startsWith("http") || avatar.startsWith("blob")) return avatar;
  if (avatar.startsWith("/")) return `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${avatar}`;
  return `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/${avatar}`;
};


function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  }
  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchKeyword.trim() !== '') {
      navigate(`/movies/search?keyword=${encodeURIComponent(searchKeyword)}`);
      setSearchKeyword('');
    }
  }
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Lấy danh sách thể loại 
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    movieService.getCategories()
      .then(data => {
        setCategoryList(data);
      })
      .catch(err => console.error("Lỗi:", err));
  }, []);
  // Effect để xử lý click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu dropdown đang mở VÀ click không phải là bên trong phần tử dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Thêm event listener khi dropdown mở
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Gỡ bỏ event listener khi component unmount hoặc khi dropdown đóng
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className={styles.nav}>
      <div className={styles.Logo}>
        <Link to="/">
          <img src={logo_web} alt="Logo" />
        </Link>
      </div>
      <div className={styles.Header}>
        <ul>
          <li>
            <Link to="/">TRANG CHỦ</Link>
          </li>
          <div className="category-drown">
            <li className={styles.dropdown}>
              <span className={styles['dropdown-title']}> THỂ LOẠI</span>
              <div className={styles['dropdown-content']}>
                {categoryList.map((category) => (
                  <Link key={category.category_id} to={`/the-loai/${encodeURIComponent(category.category_name)}`}>
                    {category.category_name}
                  </Link>
                ))}
              </div>
            </li>
          </div>
        </ul>
      </div>
      <div className={styles.Search}>
        <ul>
          <li>
            <div className={styles['search-container']}>
              <input
                placeholder="Tìm kiếm phim"
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
                className={styles['search-input']}
              />
              <FaSearch 
                className={styles['search-icon']} 
                onClick={() => {
                  if (searchKeyword.trim() !== '') {
                    navigate(`/movies/search?keyword=${encodeURIComponent(searchKeyword)}`);
                    setSearchKeyword('');
                  }
                }}
              />
            </div>
          </li>
          <li>
            {user ? (
              <div className={styles['user-info']} ref={dropdownRef}>
                <div className={styles['user-dropdown']}>
                  <button 
                    className={styles['avatar-btn']} 
                    onClick={() => setShowDropdown(!showDropdown)}
                    aria-label="Tài khoản"
                  >
                    <img 
                      src={getAvatarSrc(user.avatar_url)} 
                      alt="Avatar" 
                      className={styles['avatar-img']} 
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_name)}&background=random` }} 
                    />
                  </button>
                  {showDropdown && (
                    <div className={styles['dropdown-menu']}>
                      <div className={styles['dropdown-header']}>
                        <div className={styles['dropdown-user-name']}>{user.user_name}</div>
                        <div className={styles['dropdown-user-email']}>{user.email}</div>
                      </div>
                      
                      <div className={styles['dropdown-divider']}></div>
                      
                      <div 
                        className={styles['dropdown-item']} 
                        onClick={() => {
                          navigate("/profile");
                          setShowDropdown(false);
                        }}
                      >
                        <FaUserCog className={styles.icon} />
                        <span>Quản lý tài khoản</span>
                      </div>
                      
                      <div 
                        className={styles['dropdown-item']} 
                        onClick={() => {
                          navigate("/movies/favorites");
                          setShowDropdown(false);
                        }}
                      >
                        <FaHeart className={styles.icon} />
                        <span>Danh sách yêu thích</span>
                      </div>
                      
                      <div 
                        className={styles['dropdown-item']} 
                        onClick={() => {
                          navigate("/movies/watch-history");
                          setShowDropdown(false);
                        }}
                      >
                        <FaHistory className={styles.icon} />
                        <span>Lịch sử xem phim</span>
                      </div>
                      
                      <div className={styles['dropdown-divider']}></div>
                      
                      <div 
                        className={`${styles['dropdown-item']} ${styles['dropdown-item-logout']}`}
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                      >
                        <FaSignOutAlt className={styles.icon} />
                        <span>Đăng xuất</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className={styles.Login}>
                Đăng Nhập
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;