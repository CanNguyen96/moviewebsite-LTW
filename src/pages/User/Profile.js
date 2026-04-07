
import styles from '../../styles/Home.module.css'; 
import Notification from '../../components/Notification';
import Profile from '../../components/Profile';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <Notification />
                <Profile />
            </div>
        </div>
    );
}

export default TheLoai;