
import styles from '../../styles/Home.module.css'; 
import Notification from '../../components/Notification';
import Favoties from '../../components/Favorites';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <Notification />
                <Favoties />
            </div>
        </div>
    );
}

export default TheLoai;