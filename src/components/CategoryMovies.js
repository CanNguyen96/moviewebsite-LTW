import { useParams } from "react-router-dom";
import { movieService } from "../services/movieService";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styles from '../styles/CategoryMovies.module.css';
import { buildImageSrc } from '../utils/image';


export default function CategoryMovies() {
  const { name } = useParams();
  const categoryName = decodeURIComponent(name);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Rendering CategoryMovies, current error state:', error);
  console.log('Rendering CategoryMovies, current movies length:', movies.length);

  useEffect(() => {
    console.log('useEffect triggered for category:', categoryName);

    setLoading(true);
    setError(null);

    movieService.getCategoryMovies(categoryName)
      .then(data => {
        console.log('API call successful, data received:', data);
        setMovies(data);
      })
      .catch(err => {
        console.error("Lỗi khi lấy phim theo thể loại:", err.response); // LOG 3: Log phản hồi lỗi từ server

        // Kiểm tra nếu lỗi là 404 từ backend và có message
        if (err.response && err.response.status === 404 && err.response.data && err.response.data.message) {
          console.log('Đã vào khối xử lý 404, set error:', err.response.data.message);
          setError(err.response.data.message);
        } else {
          // Xử lý các lỗi khác (ví dụ: 500 Internal Server Error, lỗi mạng, ...)
          console.log('Đã vào khối xử lý lỗi khác:', err);
          setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.'); // Thông báo lỗi chung
          setMovies([]); // Đảm bảo mảng phim rỗng khi có lỗi
        }
      })
      .finally(() => {
        console.log('API call finished, setting loading to false');
        setLoading(false);
      });

  }, [categoryName]);

  return (
    <div className={styles['category-page']}>
      <h2>Thể loại: {categoryName}</h2>

      {loading && <p>Đang tải danh sách phim...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        movies.length > 0 ? (
          <ul className={styles['movie-grid']}>
            {movies.map(m => (
              <li key={m.id}>
                <Link to={`/movieDetail/${m.id}`}>
                  <img src={buildImageSrc(m.image_url)} alt={m.title} />
                  <p>{m.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          // Hiển thị khi không tải, không lỗi, và mảng phim rỗng
          <p>Chưa có phim nào trong thể loại này.</p>
        )
      )}
    </div>
  );
}