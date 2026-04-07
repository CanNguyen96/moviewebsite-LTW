
import styles from '../../styles/Home.module.css'; 
import Notification from '../../components/Notification';
import List from '../../components/List';


function DangAnime(){
    return(
        <div>
            <div className={styles.content}>
                <Notification />
                <List />
            </div>
        </div>
    );
}

export default DangAnime;
