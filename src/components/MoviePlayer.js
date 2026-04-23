import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "../styles/MoviePlayer.module.css";
import { movieService } from "../services/movieService";
import { reviewService } from "../services/reviewService";
import { userService } from "../services/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HlsVideoPlayer from "./movie-player/HlsVideoPlayer";
import EpisodeList from "./movie-player/EpisodeList";
import ReviewSection from "./movie-player/ReviewSection";

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
            const response = await userService.recordWatchHistory(movieId);
            console.log("Phản hồi từ server:", response);
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
                const movieData = await movieService.getMovieById(id);
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

                const reviewsData = await reviewService.getReviewsByMovieId(id);
                if (isMounted) {
                    setReviews(reviewsData);
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
            await reviewService.addReview(id, newComment);
            setNewComment("");
            const data = await reviewService.getReviewsByMovieId(id);
            setReviews(data);
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
                        <HlsVideoPlayer src={currentEpisode?.video_url} styles={styles} />
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
                    <EpisodeList 
                        movie={movie} 
                        currentEpisode={currentEpisode} 
                        onEpisodeClick={handleEpisodeClick} 
                        styles={styles} 
                    />

                    {/* 2. Review Section */}
                    <ReviewSection 
                        reviews={reviews} 
                        newComment={newComment} 
                        setNewComment={setNewComment} 
                        onReviewSubmit={handleReviewSubmit} 
                        styles={styles} 
                    />
                </div>
            </div>
        </div>
    );
};

export default MoviePlayer;