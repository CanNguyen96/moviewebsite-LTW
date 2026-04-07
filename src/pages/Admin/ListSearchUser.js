import styles from '../../styles/Home.module.css';
import SearchUser from '../../components/SearchUser';

function Home(){
    return(
        <div>
            <div className={styles.content}>
            <SearchUser></SearchUser>
            </div>
        </div>
    );
};
export default Home;