
import styles from '../../styles/Home.module.css'; 
import Favoties from '../../components/Favorites';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <Favoties />
            </div>
        </div>
    );
}

export default TheLoai;