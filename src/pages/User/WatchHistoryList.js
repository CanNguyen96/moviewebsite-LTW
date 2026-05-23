
import styles from '../../styles/Home.module.css'; 
import WatchHistory from '../../components/WatchHistory';

function WatchHistoryList() {
    return (
        <div>
            <div className={styles.content}>
                <WatchHistory />
            </div>
        </div>
    );
}

export default WatchHistoryList;