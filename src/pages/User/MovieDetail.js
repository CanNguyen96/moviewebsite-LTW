
import styles from '../../styles/Home.module.css'; 
import Notification from '../../components/Notification';
import MovieDetail from '../../components/MovieDetail';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <Notification />
                <MovieDetail />
            </div>
        </div>
    );
}

export default TheLoai;