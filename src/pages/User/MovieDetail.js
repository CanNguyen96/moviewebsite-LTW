
import styles from '../../styles/Home.module.css'; 
import MovieDetail from '../../components/MovieDetail';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <MovieDetail />
            </div>
        </div>
    );
}

export default TheLoai;