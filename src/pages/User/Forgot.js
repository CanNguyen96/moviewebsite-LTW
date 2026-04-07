
import styles from "../../styles/Home.module.css";
import Notification from "../../components/Notification";
import ForgotPassword from "../../components/ForgotPassword";

function Forgot() {
    return (
        <div className={styles.content}>
            <Notification />
            <ForgotPassword />
        </div>
    );
}

export default Forgot;