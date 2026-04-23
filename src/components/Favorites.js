import {useEffect, useState} from "react";
import { userService } from "../services/userService";
import { toast } from "react-toastify";
import {Link, useNavigate } from "react-router-dom";
import styles from '../styles/Favorites.module.css';


function Favorites(){
    const [favoriteMovies, setFavoriteMovies]= useState([]);
    const [loading, setLoading]= useState(true);
    const navigate= useNavigate();
    

    useEffect(()=>{
        setLoading(true);

        const token= localStorage.getItem('token');
        if(!token){
            toast.info("Vui lòng đăng nhập để xem danh sách yêu thích");
            setLoading(false);
            return;
        }

        const fetchFavoriteMovies= async ()=>{
            try{
                const data = await userService.getFavorites();
                setFavoriteMovies(data);
            }catch(err){
                console.error("Lỗi lấy danh sách phim yêu thích", err);
                toast.error("Không thể tải danh sách phim yêu thích");
                setFavoriteMovies([]);
            } finally{
                setLoading(false);
            }
        };
        fetchFavoriteMovies();
    },[navigate]);
    
    if(loading){
        return <div>Đang tải danh sách phim yêu thích...</div>
    }
    return(
        <div className={styles['favorite-movies-container']}>
            <h2>Danh sách phim yêu thích của bạn</h2>
            {/* Kiểm tra nếu không loading và danh sách rỗng */}
            {!loading && favoriteMovies.length===0 ? (
                // Kiểm tra lại token để chắc chắn người dùng đã đăng nhập trước đó
                localStorage.getItem('token') ? (
                    <div className={styles['no-favorites']}>Bạn chưa có phim trong danh sách yêu thích</div>
                ):null // Nếu chưa đăng nhập, hiện thị thông báo trên
            ):(
                //Nếu không loading và danh sách không rỗng, hiện thị danh sách phim
                <div className={styles['movie-list']}>
                    {favoriteMovies.map(movie =>(
                        <Link key={movie.movie_id} to = {`/movieDetail/${movie.movie_id}`} className={styles['movie-card']}>
                            <img src={`${process.env.REACT_APP_API_URL}${movie.image_url}`} alt={movie.title} />
                            <div className={styles['movie-title']}>{movie.title}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Favorites;