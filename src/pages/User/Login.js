

import styles from "../../styles/Home.module.css";
import LoginForm from "../../components/LoginForm";
function Login(){
    return(
        <div className={styles.content}>
            <LoginForm/>
        </div>

    )
}
export default Login;