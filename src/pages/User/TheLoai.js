
import styles from '../../styles/Home.module.css'; 
import CategoryMovies from '../../components/CategoryMovies';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <CategoryMovies />
            </div>
        </div>
    );
}

export default TheLoai;