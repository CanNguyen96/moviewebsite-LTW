import styles from '../../styles/Home.module.css';
import ListMovie from '../../components/ListMovie';

function Home(){
    return(
        <div>
            <div className={styles.content}>
            <ListMovie></ListMovie>
            </div>
        </div>
    );
};
export default Home;