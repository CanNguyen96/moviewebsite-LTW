import styles from '../../styles/Home.module.css';
import EpisodesManager from '../../components/EpisodesContent';

function Home(){
    return(
        <div>
            <div className={styles.content}>
            <EpisodesManager></EpisodesManager>
            </div>
        </div>
    );
};
export default Home;