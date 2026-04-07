
import styles from '../../styles/Home.module.css'; 
import Notification from '../../components/Notification';
import CategoryMovies from '../../components/CategoryMovies';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <Notification />
                <CategoryMovies />
            </div>
        </div>
    );
}

export default TheLoai;