
import styles from '../../styles/Home.module.css'; 
import Notification from '../../components/Notification';
import SearchResults from '../../components/SearchResults';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <Notification />
                <SearchResults />
            </div>
        </div>
    );
}

export default TheLoai;