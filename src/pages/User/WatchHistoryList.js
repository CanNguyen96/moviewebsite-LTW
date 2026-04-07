
import styles from '../../styles/Home.module.css'; 
import Notification from '../../components/Notification';
import WatchHistory from '../../components/WatchHistory';

function WatchHistoryList() {
    return (
        <div>
            <div className={styles.content}>
                <Notification />
                <WatchHistory />
            </div>
        </div>
    );
}

export default WatchHistoryList;