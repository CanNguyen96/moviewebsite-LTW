

import styles from "../../styles/Home.module.css";
import RegisterForm from "../../components/RegisterForm";

function register(){
    return(
        <div className={styles.content}>
            <RegisterForm/>
        </div>
    )
}
export default register;