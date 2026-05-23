
import styles from '../../styles/Home.module.css'; 
import SearchResults from '../../components/SearchResults';


function TheLoai(){
    return(
        <div>
            <div className={styles.content}>
                <SearchResults />
            </div>
        </div>
    );
}

export default TheLoai;