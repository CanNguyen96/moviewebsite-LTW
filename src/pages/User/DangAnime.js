
import styles from '../../styles/Home.module.css'; 
import List from '../../components/List';


function DangAnime(){
    return(
        <div>
            <div className={styles.content}>
                <List />
            </div>
        </div>
    );
}

export default DangAnime;
