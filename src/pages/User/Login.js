

import styles from "../../styles/Home.module.css";
import Notification from "../../components/Notification";
import LoginForm from "../../components/LoginForm";
function Login(){
    return(
        <div className={styles.content}>
            <Notification/>
            <LoginForm/>
        </div>

    )
}
export default Login;