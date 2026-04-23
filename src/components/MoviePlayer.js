import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "../styles/MoviePlayer.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hls from "hls.js";

// Component phát video HLS tự làm giống code HTML Vanilla của bạn
const HlsVideoPlayer = ({ src }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        let hls;

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(err => {
                    console.log("Trình duyệt chặn autoplay âm thanh, người dùng cần bấm play thủ công:", err);
                });
            });
        }
        // Hỗ trợ riêng cho trình duyệt Safari (Native HLS)
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', function () {
                video.play().catch(err => console.log(err));
            });
        }

        // Cleanup (Dọn dẹp hls khi đổi tập hoặc rời trang)
        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]);

    return (
        <video 
            ref={videoRef} 
            controls 
            className={styles['react-player-styled']} 
            style={{ width: '100%', height: '100%', backgroundColor: '#000', outline: 'none' }}
        />
    );
};

const MoviePlayer = () => {
    const { id, episodeNumber } = useParams();
    const [movie, setMovie] = useState(null);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();
    const isHistoryRecorded = useRef(false);

    // Kểm tra xem URL là chuẩn video để dùng ReactPlayer hay là dạng iframe embed
    const isVideoUrl = (url) => {
        if (!url) return false;
        const lowerUrl = url.toLowerCase();
        return (
            lowerUrl.includes(".m3u8") ||
            lowerUrl.includes(".mp4") ||
            lowerUrl.includes("youtube.com") ||
            lowerUrl.includes("youtu.be") ||
            lowerUrl.includes("vimeo.com")
        );
    };

    const handleTokenError = useCallback((err) => {
        if (err.response && err.response.status === 403 && err.response.data?.error === 'Token không hợp lệ hoặc đã hết hạn') {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            localStorage.removeItem("token");
            navigate("/login");
            return true;
        }
        return false;
    }, [navigate]);

    const recordHistoryToDB = useCallback(async (movieId) => {
        if (isHistoryRecorded.current) {
            console.log("Lịch sử đã được ghi trước đó, bỏ qua.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Không có token, bỏ qua ghi lịch sử.");
            return;
        }

        if (!movieId) {
            console.log("movieId không hợp lệ:", movieId);
            toast.error("Không thể ghi lịch sử: movieId không hợp lệ");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/watch-history`,
                { movie_id: movieId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Phản hồi từ server:", response.data);
            isHistoryRecorded.current = true;
        } catch (err) {
            console.error("Lỗi chi tiết khi ghi lịch sử:", err.response?.data || err.message);
            if (!handleTokenError(err)) {
                toast.error("Không thể ghi lịch sử xem phim: " + (err.response?.data?.error || err.message));
            }
        }
    }, [handleTokenError]);

    useEffect(() => {
        console.log("useEffect chạy với id:", id, "và episodeNumber:", episodeNumber);
        let isMounted = true;

        const fetchMovieData = async () => {
            try {
                const movieRes = await fetch(`${process.env.REACT_APP_API_URL}/api/movies/${id}`);
                const movieData = await movieRes.json();
                console.log("Dữ liệu phim chi tiết:", movieData);

                if (!isMounted) return;

                if (movieData.episodes && Array.isArray(movieData.episodes)) {
                    setMovie(movieData);
                    let episodeToPlay = null;
                    if (episodeNumber) {
                        episodeToPlay = movieData.episodes.find(
                            (ep) => Number(ep.episode) === Number(episodeNumber)
                        );
                    }
                    if (!episodeToPlay && movieData.episodes.length > 0) {
                        episodeToPlay = movieData.episodes[0];
                    }
                    setCurrentEpisode(episodeToPlay);
                } else {
                    setMovie({ ...movieData, episodes: [] });
                }

                if (movieData && movieData.title && id && !isHistoryRecorded.current) {
                    await recordHistoryToDB(id);
                }

                const reviewsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/${id}`);
                if (isMounted) {
                    setReviews(reviewsRes.data);
                }
            } catch (err) {
                console.error("Lỗi fetch dữ liệu phim:", err);
                if (isMounted) {
                    toast.error("Không thể tải dữ liệu phim.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchMovieData();

        return () => {
            isMounted = false;
            isHistoryRecorded.current = false;
        };
    }, [id, episodeNumber, recordHistoryToDB]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để gửi đánh giá!");
            navigate("/login");
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/reviews`,
                { movie_id: id, comment: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewComment("");
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/${id}`);
            setReviews(res.data);
            toast.success("Gửi bình luận thành công!");
        } catch (err) {
            toast.error("Lỗi khi gửi bình luận: " + (err.response?.data?.error || "Thử lại sau"));
        }
    };

    const handleEpisodeClick = (ep) => {
        console.log("handleEpisodeClick được gọi với ep:", ep, "movie_id:", id);
        setCurrentEpisode(ep);
        navigate(`/movie/${id}/episode/${ep.episode}`, { replace: true });
        if (!isHistoryRecorded.current) {
            recordHistoryToDB(id);
        }
    };

    if (loading) return <div className="loading-indicator">Đang tải...</div>;
    if (!movie) return <div className="error-message">Không tìm thấy phim!</div>;

    return (
        <div className={styles['movie-player-page']}>
            <div className={styles['movie-player-container']}>
                <div className={styles.breadcrumb}>
                    <Link to="/">Trang chủ</Link> / <Link to={`/movieDetail/${id}`}>{movie.title}</Link> /{" "}
                    <span className={styles['current-ep-text']}>{currentEpisode?.title || `Tập ${currentEpisode?.episode}`}</span>
                </div>
                
                <div className={styles['video-player-wrapper']}>
                    {isVideoUrl(currentEpisode?.video_url) ? (
                        <HlsVideoPlayer src={currentEpisode?.video_url} />
                    ) : (
                        <iframe
                            key={currentEpisode?.episode_id}
                            width="100%"
                            height="100%"
                            src={currentEpisode?.video_url}
                            title={movie.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
                
                <div className={styles['player-content-stacked']}>
                    {/* 1. Episode List */}
                    <div className={styles['episode-list-card']}>
                        <h3>DANH SÁCH TẬP</h3>
                        <div className={styles['episodes-grid']}>
                            {Array.isArray(movie.episodes) && movie.episodes.length > 0 ? (
                                [...movie.episodes]
                                    .sort((a, b) => Number(a.episode) - Number(b.episode))
                                    .map((ep, index) => (
                                    <button
                                        key={`episode-${index}`}
                                        className={`${styles['ep-btn']} ${Number(ep.episode) === Number(currentEpisode?.episode) ? styles.active : ""}`}
                                        onClick={() => handleEpisodeClick(ep)}
                                    >
                                        {ep.episode}
                                    </button>
                                ))
                            ) : (
                                <p className={styles['text-muted']}>Hiện chưa có tập phim.</p>
                            )}
                        </div>
                    </div>

                    {/* 2. Review Section */}
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
                                reviews.map((review, index) => (
                                    <div key={`review-${index}`} className={styles['review-item']}>
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
        </div>
    );
};

export default MoviePlayer;