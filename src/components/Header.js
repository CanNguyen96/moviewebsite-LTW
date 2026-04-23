"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo_web from "../picture/logo-1.webp";
import { movieService } from "../services/movieService";
import { useAuth } from "../contexts/AuthContext";


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
            <input
              placeholder="Tìm kiếm"
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
          </li>
          <li>
            {user ? (
              <div className={styles['user-info']} ref={dropdownRef}>
                <div className={styles['user-dropdown']}>
                  <div className={styles['user-name']} onClick={() => setShowDropdown(!showDropdown)}>
                    Xin chào, {user.user_name}
                  </div>
                  {showDropdown && (
                    <ul className={styles['dropdown-menu']}>
                      <li onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}>Quản lý tài khoản</li>
                      <li onClick={() => {
                        navigate("/movies/favorites");
                        setShowDropdown(false)
                      }}>Danh sách yêu thích</li>
                      <li onClick={() => {
                        navigate("/movies/watch-history");
                        setShowDropdown(false);
                      }}>Lịch sử xem phim</li>
                    </ul>
                  )}
                </div>
                <button onClick={handleLogout} className={styles['logout-btn']}>
                  Đăng Xuất
                </button>
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