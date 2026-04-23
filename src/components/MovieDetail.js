import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "../styles/MovieDetail.module.css";
import { movieService } from "../services/movieService";
import { reviewService } from "../services/reviewService";
import { userService } from "../services/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [hoverStar, setHoverStar] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieData = await movieService.getMovieById(id);

                if (movieData) {
                    setMovie(movieData);
                } else {
                    setMovie(null);
                }
                // 2. Fetch Đánh giá phim
                const reviewsData = await reviewService.getReviewsByMovieId(id);
                setReviews(reviewsData);

                const token = localStorage.getItem("token");
                if (token) {
                    try {
                        const statusData = await userService.checkFavoriteStatus(id);
                        setIsFavorite(statusData.isFavorite);
                    } catch (statusErr) {
                        console.error("Lỗi kiểm tra trạng thái yêu thích:", statusErr);
                        setIsFavorite(false);
                    }
                } else {
                    setIsFavorite(false);
                }

                // Gọi API tăng lượt xem
                try {
                    await movieService.increaseView(id);
                } catch (viewErr) {
                    console.error("Lỗi tăng lượt xem:", viewErr);
                }

            } catch (err) {
                console.error("Lỗi fetch dữ liệu phim:", err);
                toast.error("Không thể tải dữ liệu phim.");
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    const toggleFavorite = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
            navigate("/login");
            return;
        }
        try {
            if (isFavorite) {
                await userService.removeFavorite(id);
                setIsFavorite(false);
                toast.success("Đã xóa khỏi danh sách yêu thích");
            } else {
                await userService.addFavorite(id);
                setIsFavorite(true);
                toast.success("Đã thêm vào danh sách yêu thích");
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật yêu thích:", err);
            toast.error("Có lỗi khi cập nhật yêu thích. Thử lại sau!");
        }
    };
    // Hàm xử lý gửi bình luận mới 
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để gửi bình luận!");
            navigate("/login");
            return;
        }

        try {
            await reviewService.addReview(id, newComment);
            setNewComment("");
            const reviewsData = await reviewService.getReviewsByMovieId(id);
            setReviews(reviewsData);
            toast.success("Gửi bình luận thành công!");
        } catch (err) {
            toast.error("Lỗi khi gửi bình luận. Thử lại sau!");
        }
    };

    // Hàm gọi API đánh giá phim bằng Popup Modal 10 Sao
    const submitRatingFromModal = async (selectedRating) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để gửi đánh giá!");
            navigate("/login");
            return;
        }

        try {
            const resRating = await movieService.rateMovie(id, selectedRating);
            setShowRatingModal(false);
            
            // Cập nhật lại thông tin phim để hiển thị rating mới
            setMovie(prev => ({
                ...prev,
                avg_rating: parseFloat(resRating.average_rating).toFixed(1)
            }));
            toast.success("Đánh giá điểm phim thành công!");
        } catch (err) {
            toast.error("Lỗi khi gửi đánh giá. Thử lại sau!");
        }
    };

    if (loading) return <div className="loading-indicator">Đang tải...</div>;
    if (!movie) return <div className="error-message">Không tìm thấy phim!</div>;

    const newestEpisode = movie.episodes && movie.episodes.length > 0
    ? [...movie.episodes].sort((a, b) => Number(b.episode) - Number(a.episode))[0]
    : null;

    return (
        <div className={styles['movie-detail-page']}>
            <div className={styles['movie-background']}>
                <div className={styles['movie-header']}>
                    <div className={styles['movie-detail-poster-container']}>
                        <img 
                            src={`${process.env.REACT_APP_API_URL}${movie.image_url}`} 
                            onError={(e) => { e.target.src = '/images/placeholder.jpg' }} 
                            alt={movie.title} 
                            className={styles['poster-img']}
                        />
                        <div className={styles['movie-button']}>
                            {newestEpisode ? (
                                <Link to={`/movie/${id}/episode/${newestEpisode.episode}`} className={styles['watch-movie-btn']}>
                                    XEM PHIM
                                </Link>
                            ) : (
                                <button className={`${styles['watch-movie-btn']} ${styles.disabled}`} disabled>
                                    CẬP NHẬT
                                </button>
                            )}
                            <button
                                onClick={toggleFavorite}
                                className={`${styles['favorite-btn']} ${isFavorite ? styles.remove : ''}`}
                            >
                                THÊM YÊU THÍCH
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles['movie-info']}>
                        <div className={styles['info-row']}>
                            <span className={styles['info-label']}>Tên</span>
                            <span className={`${styles['info-value']} ${styles['highlight-title']}`}>{movie.title}</span>
                        </div>
                        <div className={styles['info-row']}>
                            <span className={styles['info-label']}>Tên Khác</span>
                            <span className={`${styles['info-value']} ${styles['text-muted']}`}>{movie.title}</span>
                        </div>
                        <div className={styles['info-row']}>
                            <span className={styles['info-label']}>Thể Loại</span>
                            <span className={`${styles['info-value']} ${styles.badges}`}>
                                {movie.genre ? movie.genre.split(',').map((g, idx) => (
                                    <Link key={idx} to={`/the-loai/${g.trim()}`} className={`${styles.badge} ${styles['badge-link']}`}>
                                        {g.trim()}
                                    </Link>
                                )) : <span className={styles.badge}>Đang cập nhật...</span>}
                            </span>
                        </div>
                        <div className={styles['info-row']}>
                            <span className={styles['info-label']}>Tập mới nhất</span>
                            <span className={styles['info-value']}>
                                <span className={styles['badge-new']}>{newestEpisode ? `Tập ${newestEpisode.episode}` : 'Đang cập nhật'}</span>
                            </span>
                        </div>
                        <div className={styles['info-row']}>
                            <span className={styles['info-label']}>Lượt Xem</span>
                            <span className={`${styles['info-value']} ${styles['text-muted']}`}>👁 {movie.views_count || 0} lượt xem</span>
                        </div>
                        <div className={styles['info-row']}>
                            <span className={styles['info-label']}>Thông Tin Khác</span>
                            <span className={`${styles['info-value']} ${styles['text-muted']}`}>🎬 {movie.duration || 'Đang cập nhật...'}</span>
                        </div>
                        <div className={styles['info-row']}>
                            <span className={styles['info-label']}>Đánh Giá</span>
                            <span className={`${styles['info-value']} ${styles['rating-info']}`}>
                                <span className={styles['rating-star']}>⭐ {movie.avg_rating || '5.0'}/10</span> 
                                <span className={styles['rating-count']}>({movie.total_reviews || 0} lượt đánh giá)</span>
                                <button className={styles['rate-btn']} onClick={() => setShowRatingModal(true)}>Đánh Giá</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className={styles['rating-modal-overlay']} onClick={() => setShowRatingModal(false)}>
                    <div className={styles['rating-modal-content']} onClick={e => e.stopPropagation()}>
                        <div className={styles['rating-modal-header']}>
                            <h4>Đánh giá phim</h4>
                            <button className={styles['close-modal-btn']} onClick={() => setShowRatingModal(false)}>✕</button>
                        </div>
                        <div className={styles['rating-stars-container']}>
                            {[...Array(10)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <span 
                                        key={starValue}
                                        className={`${styles['star-icon']} ${starValue <= (hoverStar || 0) ? styles.active : ""}`}
                                        onMouseEnter={() => setHoverStar(starValue)}
                                        onMouseLeave={() => setHoverStar(0)}
                                        onClick={() => submitRatingFromModal(starValue)}
                                    >
                                        ★
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className={styles['movie-content-container']}>
                <div className={styles['episode-selection']}>
                    {movie.episodes && movie.episodes.length > 0 ? (
                        [...movie.episodes]
                            .sort((a, b) => Number(b.episode) - Number(a.episode))
                            .map((ep) => (
                            <Link key={ep.episode_id} to={`/movie/${id}/episode/${ep.episode}`} className={styles['episode-btn-square']}>
                                {ep.episode}
                            </Link>
                        ))
                    ) : (
                         <p className={styles['text-muted']}>Chưa có tập phim nào.</p>
                    )}
                </div>

                <div className={styles['movie-summary-section']}>
                    <h3>TÓM TẮT PHIM</h3>
                    <p>{movie.description}</p>
                </div>

                <div className={styles['review-section']}>
                    <div className={styles['review-header']}>
                        <h3>Bình luận ({reviews.length})</h3>
                        <span className={styles['refresh-icon']}>↻</span>
                    </div>
                    
                    <form onSubmit={handleReviewSubmit} className={styles['comment-form']}>
                        <textarea
                            placeholder="Nhập bình luận của bạn tại đây"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        ></textarea>
                        <div className={styles['comment-actions']}>
                            <div className="action-left">
                            </div>
                            <button type="submit" className={styles['submit-comment-btn']}>Gửi</button>
                        </div>
                    </form>

                    <div className="reviews-list">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.review_id} className={styles['review-item']}>
                                    <div className={styles['review-avatar']}>
                                        <img src={review.avatar_url || "/images/default-avatar.png"} alt="Avatar" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + review.user_name + '&background=random' }} />
                                        <div className={styles['user-level']}>Lv 12</div>
                                    </div>
                                    <div className={styles['review-content']}>
                                        <div className={styles['review-user']}>
                                            <strong>{review.user_name}</strong> 
                                        </div>
                                        <p className={styles['review-text']}>{review.comment}</p>
                                        <div className={styles['review-time']}>
                                            <span className={styles['reply-btn']}>Trả lời</span> {new Date(review.review_date).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles['text-muted']} style={{color: '#999'}}>Chưa có đánh giá nào.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;