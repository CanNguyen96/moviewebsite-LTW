import styles from '../../styles/Home.module.css';
import ListUser from '../../components/ListUser';

function Home(){
    return(
        <div>
            <div className={styles.content}>
            <ListUser></ListUser>
            </div>
        </div>
    );
};
export default Home;