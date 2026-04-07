

import styles from "../../styles/Home.module.css";
import Notification from "../../components/Notification";
import RegisterForm from "../../components/RegisterForm";

function register(){
    return(
        <div className={styles.content}>
            <Notification/>
            <RegisterForm/>
        </div>
    )
}
export default register;