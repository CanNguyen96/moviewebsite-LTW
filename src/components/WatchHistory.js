import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ConfirmModal from './ConfirmModal';
import styles from '../styles/WatchHistory.module.css';

function WatchHistory() {
    const [watchHistory, setWatchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            toast.info("Vui lòng đăng nhập để xem lịch sử xem phim");
            setLoading(false);
            return;
        }

        const fetchWatchHistory = async () => {
            try {
                const data = await userService.getWatchHistory();
                setWatchHistory(data);
            } catch (err) {
                console.error("Lỗi lấy danh sách lịch sử xem phim", err);
                toast.error("Không thể tải lịch sử xem phim");
                setWatchHistory([]);
            } finally {
                setLoading(false);
            }
        };
        fetchWatchHistory();
    }, []);

    // Hàm xóa một bản ghi lịch sử
    const handleDeleteHistoryItem = async (movie_id) => {
        try {
            await userService.deleteWatchHistory(movie_id);
            setWatchHistory(watchHistory.filter(item => item.movie_id !== movie_id));
        } catch (err) {
            console.error("Lỗi xóa lịch sử xem phim:", err);
            toast.error("Không thể xóa bản ghi lịch sử xem phim");
        }
    };

    // Hàm xóa toàn bộ lịch sử
    const handleDeleteAllHistoryClick = () => {
        setIsConfirmOpen(true);
    };

    const confirmDeleteAll = async () => {
        setIsConfirmOpen(false);
        try {
            await userService.deleteAllWatchHistory();
            setWatchHistory([]);
            toast.success("Đã xóa toàn bộ lịch sử xem phim!");
        } catch (err) {
            console.error("Lỗi xóa toàn bộ lịch sử xem phim:", err);
            toast.error("Không thể xóa toàn bộ lịch sử xem phim");
        }
    };

    if (loading) {
        return <div>Đang tải lịch sử xem phim...</div>;
    }

    return (
        <div className={styles['watch-history-container']}>
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem phim?"
                onConfirm={confirmDeleteAll}
                onCancel={() => setIsConfirmOpen(false)}
            />
            <div className={styles['header-container']}>
                <h2>Lịch sử xem phim của bạn</h2>
                {watchHistory.length > 0 && (
                    <button className={styles['delete-all-button']} onClick={handleDeleteAllHistoryClick}>
                        Xóa toàn bộ lịch sử
                    </button>
                )}
            </div>
            {!loading && watchHistory.length === 0 ? (
                localStorage.getItem('token') ? (
                    <div className={styles['no-history']}>Bạn chưa xem phim nào</div>
                ) : null
            ) : (
                <div className={styles['movie-list']}>
                    {watchHistory.map(history => (
                        <div key={history.movie_id} className={styles['movie-card-wrapper']}>
                            <Link to={`/movieDetail/${history.movie_id}`} className={styles['movie-card']}>
                                <img src={`${process.env.REACT_APP_API_URL}${history.image_url}`} alt={history.title} />
                                <div className={styles['movie-title']}>{history.title}</div>
                                <div className={styles['watched-at']}>Xem lúc: {new Date(history.watched_at).toLocaleString()}</div>
                            </Link>
                            <button
                                className={styles['delete-button']}
                                onClick={() => handleDeleteHistoryItem(history.movie_id)}
                            >
                                Xóa
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WatchHistory;