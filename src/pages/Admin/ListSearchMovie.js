import styles from '../../styles/Home.module.css';
import SearchMovie from '../../components/SearchMovie';

function Home(){
    return(
        <div>
            <div className={styles.content}>
            <SearchMovie></SearchMovie>
            </div>
        </div>
    );
};
export default Home;