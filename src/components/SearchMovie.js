import { movieService } from "../services/movieService";
import { useLocation,Link } from "react-router-dom";
import styles from '../styles/ListMovie.module.css';
import { useEffect, useState } from "react";


function useQuery(){
    return new URLSearchParams(useLocation().search);
}

function SearchMovie(){
    const query= useQuery();
    const movieName= query.get('movieName');

    const [movies, setMovies]= useState([]);
    const [loading, setLoading]= useState(true);

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

    return(
        <div className="list-movies">
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

function AnimeItem({movie_id, title, image_url, genre, year, duration, episodes, status, styles }) {
    // Định dạng trạng thái
    const getStatusClass = () => {
        if (status === 'Approved') return 'approved';
        if (status === 'Pending') return 'pending';
        return 'review';
    };
    //
    const handleDelete = async (movie_id) => {
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
                <button onClick={() => handleDelete(movie_id)}>Xóa Phim</button>
                <Link to={`/admin/episodes/${movie_id}`}>
                    <button>Quản lý tập phim</button>
                </Link>              
            </div>


        </div>
    );
}

export default SearchMovie;