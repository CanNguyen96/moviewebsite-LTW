
import styles from '../../styles/Home.module.css'; 
import Profile from '../../components/Profile';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <Profile />
            </div>
        </div>
    );
}

export default TheLoai;