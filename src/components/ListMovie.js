import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import styles from '../styles/ListMovie.module.css';
import paginationStyles from '../styles/List.module.css';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const buildImageSrc = (imageUrl) => {
    if (!imageUrl) return '/images/placeholder.jpg';
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

function AdminList() {
    const [animeList, setAnimeList] = useState([]);
    const [currentPage, setCurrentPage]= useState(1);
    const moviesPerPage= 5;
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await movieService.getAdminMovies();
                setAnimeList(data);
            } catch (err) {
                console.error("Lỗi:", err);
            }
        };
        fetchMovies();
    }, []);
    const totalPages= Math.ceil(animeList.length/moviesPerPage);
    // Tính danh sách phim hiện thị theo trang 
    const indexOfLastMovie= currentPage * moviesPerPage;
    const indexOfFirstMovie= indexOfLastMovie - moviesPerPage;
    const currentMovies= animeList.slice(indexOfFirstMovie, indexOfLastMovie);

    const handlePageChange= (pageNumber) =>{
        setCurrentPage(pageNumber);
    }
    return (
        <div className="list-movies">
            <div className={styles['list-movie-tag']}>
                <li>Quản lý phim</li>
            </div>
            <div className={styles['button-add']}>
                <Link to={`/admin/add`}>
                    <button>THÊM PHIM</button>
                </Link>
            </div>
            <div className={styles['list-movie']}>
                {currentMovies.map((item) => (
                    <AnimeItem
                        key={item.movie_id}
                        movie_id={item.movie_id}
                        title={item.title}
                        image_url={item.image_url}
                        genre={item.genre}
                        year={item.year}
                        duration={item.duration}
                        episodes={item.episodes}
                        status={item.status}
                        styles={styles}
                    />
                ))}
            </div>
            <div className={paginationStyles.more}>
                <ul>
                    {Array.from({length: totalPages}, (_, index) =>(
                        <li key={index}>
                            <button className={`${paginationStyles['page-button']} ${currentPage === index + 1 ? paginationStyles.active : ''}`} 
                                onClick={()=> handlePageChange(index+1)}
                                >
                                {index+1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function AnimeItem({movie_id, title, image_url, genre, year, duration, episodes, status, styles }) {
    // Định dạng trạng thái
    const getStatusClass = () => {
        if (status === 'Approved') return 'approved';
        if (status === 'Pending') return 'pending';
        return 'review';
    };
    //
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa phim này không?")) {
            try {
                await movieService.deleteMovie(movie_id);
                alert("Xóa phim thành công!");
                window.location.reload(); // Load lại danh sách
            } catch (err) {
                console.error("Lỗi khi xóa:", err);
                alert("Xóa thất bại!");
            }
        }
    };

    return (
        <div className={styles['movie-item']}>
            <div className={styles['movie-image']}>
                <img
                    src={buildImageSrc(image_url)}
                    alt={title}
                    onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                    }}
                />
            </div>
            <div className={styles['movie-info']}>
                <p><strong>Tên phim:</strong> {title}</p>
                <p><strong>Thể loại:</strong> {genre}</p>
                <p><strong>Năm phát hành:</strong> {year}</p>
                <p><strong>Thời lượng:</strong> {duration} phút</p>
                {episodes && <p><strong>Số tập:</strong> {episodes} ( Đang cập nhật )</p>}
                <div className={`${styles.status} ${styles[getStatusClass()]}`}>
                    <span className={styles.dot} />
                    Trạng thái: {status}
                </div>
            </div>
            <div className={styles.actions}>
                <Link to={`/admin/edit/${movie_id}`}>
                    <button>Sửa thông tin phim</button>
                </Link>
                <button onClick={() => handleDelete(movie_id)}>Xóa Phim</button>
                <Link to={`/admin/episodes/${movie_id}`}>
                    <button>Quản lý tập phim</button>
                </Link>
            </div>

        </div>
    );
}

export default AdminList;