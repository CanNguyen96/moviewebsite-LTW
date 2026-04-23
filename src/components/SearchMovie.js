import { movieService } from "../services/movieService";
import { useLocation,Link } from "react-router-dom";
import styles from '../styles/ListMovie.module.css';
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from './ConfirmModal';


function useQuery(){
    return new URLSearchParams(useLocation().search);
}

function SearchMovie(){
    const query= useQuery();
    const movieName= query.get('movieName');

    const [movies, setMovies]= useState([]);
    const [loading, setLoading]= useState(true);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, movieId: null });

    useEffect(()=>{
        if(!movieName){
            setMovies([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        movieService.searchAdminMovies(movieName)
            .then((data)=>{
                setMovies(data);
                setLoading(false);
            })
            .catch((err)=>{
                console.log("Lỗi khi tìm kiếm phim",err);
                setMovies([]);
                setLoading(false);
            })
    },[movieName]);

    if(loading){
        return <div>Đang tải kết quả tìm kiếm</div>
    }

    const handleDeleteClick = (id) => {
        setModalConfig({ isOpen: true, movieId: id });
    };

    const confirmDelete = async () => {
        const { movieId } = modalConfig;
        setModalConfig({ isOpen: false, movieId: null });
        try {
            await movieService.deleteMovie(movieId);
            toast.success("Xóa phim thành công!");
            setMovies(movies.filter(item => item.movie_id !== movieId));
        } catch (err) {
            console.error("Lỗi khi xóa:", err);
            toast.error("Xóa thất bại!");
        }
    };

    const cancelDelete = () => {
        setModalConfig({ isOpen: false, movieId: null });
    };

    return(
        <div className="list-movies">
            <ToastContainer />
            <ConfirmModal 
                isOpen={modalConfig.isOpen}
                message="Bạn có chắc muốn xóa phim này không?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            <div className={styles['list-movie-tag']}>
                <li>Kết quả tìm kiếm cho: "{movieName}</li>
            </div>
            {movies.length>0 ?(
                <>
                <div className={styles['list-movie']}>
                {movies.map((item) => (
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
                        onDelete={() => handleDeleteClick(item.movie_id)}
                    />
                ))}
                </div>    
                </>
            ):(
                <p className={styles.No}>Không tìm thấy phim </p>
            )}
            
        </div>
    )
}

function AnimeItem({movie_id, title, image_url, genre, year, duration, episodes, status, styles, onDelete }) {
    // Định dạng trạng thái
    const getStatusClass = () => {
        if (status === 'Approved') return 'approved';
        if (status === 'Pending') return 'pending';
        return 'review';
    };

    return (
        <div className={styles['movie-item']}>
            <div className={styles['movie-image']}>
                <img
                    src={`${process.env.REACT_APP_API_URL}${image_url}` || '/placeholder.jpg'}
                    alt={title}
                    onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                    }}
                />
            </div>
            <div className={styles['movie-info']}>
                <p><strong>Tên phim:</strong> {title}</p>
                <p><strong>Thể loại:</strong> {genre}</p>
                <p><strong>Năm phát hành:</strong> {year}</p>
                <p><strong>Thời lượng:</strong> {duration} phút</p>
                {<p><strong>Số tập:</strong> {episodes} ( Đang cập nhật )</p>}
                <div className={`${styles.status} ${styles[getStatusClass()]}`}>
                    <span className={styles.dot} />
                    Trạng thái: {status}
                </div>
            </div>
            <div className={styles.actions}>
                <Link to={`/admin/edit/${movie_id}`}>
                    <button>Sửa thông tin phim</button>
                </Link>
                <button onClick={onDelete}>Xóa Phim</button>
                <Link to={`/admin/episodes/${movie_id}`}>
                    <button>Quản lý tập phim</button>
                </Link>              
            </div>


        </div>
    );
}

export default SearchMovie;