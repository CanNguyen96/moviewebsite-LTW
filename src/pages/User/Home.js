
import styles from '../../styles/Home.module.css'; 
import Notification from '../../components/Notification';
import List from '../../components/List';
import Slider from "../../components/Slider";

function Home() {
  return (
    <div>
      {/* <Header></Header> */}
      <div className={styles.content}>
        <Notification />
        <Slider />
        <List />
      </div>
    </div>
  );  
}

export default Home;
